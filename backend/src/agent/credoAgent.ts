import {
  Agent,
  InitConfig,
  KeyDerivationMethod,
  KeyType,
  type WalletStorageConfig,
} from '@credo-ts/core';
import { agentDependencies } from '@credo-ts/node';
import { AskarModule, type AskarWalletPostgresStorageConfig } from '@credo-ts/askar';
import { askar } from '@openwallet-foundation/askar-nodejs';

/** Credo agent type specialised with the AskarModule. */
export type CredoAgent = Agent<{ askar: AskarModule }>;

let agent: CredoAgent | undefined;
let issuerDidUrl: string | undefined;

/**
 * Builds the Askar storage config from environment variables.
 *
 * When `DB_TYPE=postgres`, a PostgreSQL-backed store is used (suitable for
 * production and Docker Compose). Otherwise SQLite is used (default, useful
 * for local development without Docker).
 */
function buildStorageConfig(): WalletStorageConfig | undefined {
  if (process.env['DB_TYPE'] !== 'postgres') return undefined;

  const storageConfig: AskarWalletPostgresStorageConfig = {
    type: 'postgres',
    config: {
      host: process.env['DB_HOST'] ?? 'localhost:5432',
    },
    credentials: {
      account: process.env['DB_USER'] ?? 'businesswallet',
      password: process.env['DB_PASSWORD'] ?? '',
    },
  };
  return storageConfig;
}

/**
 * Extracts the verification method ID from the first authentication method
 * in a DID document, throwing if not found. For `did:key`, there is exactly
 * one verification method and it is always the first entry.
 */
function extractVerificationMethodId(
  didDocument: { verificationMethod?: Array<{ id?: string }> } | undefined,
  context: string,
): string {
  const vm = didDocument?.verificationMethod?.[0];
  if (!vm?.id) {
    throw new Error(
      `No verification method ID found in DID document (${context})`,
    );
  }
  return vm.id;
}

/**
 * Retrieves an existing issuer `did:key` from the wallet or creates a new one
 * using P-256, which is required for SD-JWT VC ES256 signing.
 *
 * The DID is persisted in the Askar wallet across restarts.
 */
async function resolveIssuerDidUrl(credoAgent: CredoAgent): Promise<string> {
  const existingDids = await credoAgent.dids.getCreatedDids({ method: 'key' });
  if (existingDids.length > 0) {
    return extractVerificationMethodId(
      existingDids[0].didDocument,
      'existing did:key',
    );
  }

  const result = await credoAgent.dids.create({
    method: 'key',
    options: { keyType: KeyType.P256 },
  });

  if (result.didState.state !== 'finished') {
    throw new Error(
      `Failed to create issuer DID: state=${result.didState.state}`,
    );
  }

  return extractVerificationMethodId(
    result.didState.didDocument,
    'newly created did:key',
  );
}

/**
 * Initialises the Credo agent.
 *
 * Should be called once before the HTTP server starts accepting requests.
 * `WALLET_KEY` is mandatory; all other env vars have sensible defaults.
 *
 * @throws {Error} if `WALLET_KEY` is not set or agent initialisation fails.
 */
export async function initializeCredoAgent(): Promise<void> {
  const walletKey = process.env['WALLET_KEY'];
  if (!walletKey) {
    throw new Error(
      'WALLET_KEY environment variable is required to initialise the Credo agent',
    );
  }

  const storage = buildStorageConfig();

  const config: InitConfig = {
    label: 'Business Wallet',
    walletConfig: {
      id: process.env['WALLET_ID'] ?? 'business-wallet',
      key: walletKey,
      keyDerivationMethod: KeyDerivationMethod.Argon2IInt,
      ...(storage ? { storage } : {}),
    },
  };

  agent = new Agent({
    config,
    dependencies: agentDependencies,
    modules: { askar: new AskarModule({ ariesAskar: askar }) },
  });

  await agent.initialize();

  issuerDidUrl = await resolveIssuerDidUrl(agent);
  console.log(`Credo agent initialised. Issuer DID URL: ${issuerDidUrl}`);
}

/**
 * Returns the initialised Credo agent instance.
 *
 * @throws {Error} if called before {@link initializeCredoAgent}.
 */
export function getCredoAgent(): CredoAgent {
  if (!agent) {
    throw new Error(
      'Credo agent has not been initialised. Call initializeCredoAgent() first.',
    );
  }
  return agent;
}

/**
 * Returns the issuer DID URL used to sign credentials.
 *
 * @throws {Error} if called before {@link initializeCredoAgent}.
 */
export function getIssuerDidUrl(): string {
  if (!issuerDidUrl) {
    throw new Error(
      'Issuer DID URL is not set. Call initializeCredoAgent() first.',
    );
  }
  return issuerDidUrl;
}

/**
 * Gracefully shuts down the Credo agent, closing the wallet and releasing
 * resources. Should be called on process exit.
 */
export async function shutdownCredoAgent(): Promise<void> {
  await agent?.shutdown();
  agent = undefined;
  issuerDidUrl = undefined;
}
