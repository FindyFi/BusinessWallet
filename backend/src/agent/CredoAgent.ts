import { Agent, InjectionSymbols, Kms, type SdJwtVcSignOptions } from '@credo-ts/core';
import { agentDependencies, NodeKeyManagementService, NodeInMemoryKeyManagementStorage } from '@credo-ts/node';
import { DependencyManager } from '@credo-ts/core';
import { InMemoryStorageService } from '../storage/InMemoryStorageService';
import type { EmployeeCredentialRequest } from '../types/credentials';
import { EMPLOYEE_VCT_URI } from '../services/employeeCredentialService';

/** Issuer DID URL (verification method) used to sign all SD-JWT VC credentials. */
let issuerDidUrl: string | null = null;
/** Singleton Credo agent instance. */
let agentInstance: Agent | null = null;

/**
 * Build and initialise the Credo agent.
 *
 * The agent uses:
 *  - {@link NodeKeyManagementService} backed by an in-memory key store for cryptographic ops
 *  - {@link InMemoryStorageService} as the record storage backend
 *
 * Both storage layers are suitable for development and can be replaced with
 * persistent backends (Askar + PostgreSQL) for production.
 */
async function createAgent(): Promise<Agent> {
  const storage = new InMemoryStorageService();
  const dependencyManager = new DependencyManager();

  // Register the in-memory storage service before constructing the agent so that
  // the Agent constructor's missing-StorageService guard is satisfied.
  dependencyManager.registerInstance(InjectionSymbols.StorageService, storage);

  const agent = new Agent(
    {
      config: {
        // Allow http URLs in development (e.g. for VCT metadata resolution).
        allowInsecureHttpUrls: true,
        // Automatically migrate the storage schema when the framework version changes.
        autoUpdateStorageOnStartup: true,
      },
      dependencies: agentDependencies,
      modules: {
        kms: new Kms.KeyManagementModule({
          backends: [new NodeKeyManagementService(new NodeInMemoryKeyManagementStorage())],
        }),
      },
    },
    dependencyManager,
  );

  await agent.initialize();
  return agent;
}

/**
 * Initialise the Credo agent singleton and create the issuer DID.
 *
 * Idempotent — calling this multiple times is safe.
 */
export async function initCredoAgent(): Promise<void> {
  if (agentInstance !== null) return;

  agentInstance = await createAgent();

  // Create a P-256 signing key for the issuer.
  const kmsKeyResult = await agentInstance.kms.createKey({
    type: {
      kty: 'EC',
      crv: 'P-256',
    },
  });

  // Create a did:jwk DID bound to the newly created key.
  const createResult = await agentInstance.dids.create({
    method: 'jwk',
    options: { keyId: kmsKeyResult.keyId },
  });

  if (createResult.didState.state !== 'finished') {
    throw new Error(
      `Failed to create issuer DID: ${JSON.stringify(createResult.didState)}`,
    );
  }

  const didDocument = createResult.didState.didDocument;
  const verificationMethod = didDocument?.verificationMethod?.[0];
  if (!verificationMethod?.id) {
    throw new Error('Created DID document does not contain a verification method');
  }

  issuerDidUrl = verificationMethod.id;
}

/**
 * Issue a cryptographically-signed SD-JWT VC employee credential using Credo.
 *
 * @throws Error if the agent has not been initialised via {@link initCredoAgent}.
 */
export async function issueEmployeeCredential(
  request: EmployeeCredentialRequest,
): Promise<string> {
  if (agentInstance === null || issuerDidUrl === null) {
    throw new Error(
      'Credo agent is not initialised. Call initCredoAgent() during application startup.',
    );
  }

  const payload = {
    vct: EMPLOYEE_VCT_URI,
    firstName: request.firstName,
    lastName: request.lastName,
    jobTitle: request.jobTitle,
    startDate: request.startDate,
    ...(request.endDate !== undefined ? { endDate: request.endDate } : {}),
  };

  // All claims are selectively disclosable per FR-0010 / TR-0009.
  const disclosureFrame: SdJwtVcSignOptions['disclosureFrame'] = {
    _sd: Object.keys(payload).filter((k) => k !== 'vct'),
  };

  const signOptions: SdJwtVcSignOptions = {
    payload,
    issuer: {
      method: 'did',
      didUrl: issuerDidUrl,
    },
    disclosureFrame,
    headerType: 'vc+sd-jwt',
  };

  const result = await agentInstance.sdJwtVc.sign(signOptions);
  return result.compact;
}
