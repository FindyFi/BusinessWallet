import { describe, it, expect, beforeEach } from 'vitest';
import { CredentialService } from '../domain/credential-service.js';
import type { CreateCredentialRequest } from '../types/credential.js';

describe('CredentialService', () => {
  let service: CredentialService;

  beforeEach(() => {
    service = new CredentialService();
  });

  describe('issueCredential', () => {
    it('should issue a valid credential with required fields', async () => {
      const request: CreateCredentialRequest = {
        issuer: 'did:example:issuer123',
        credentialSubject: {
          id: 'did:example:holder456',
          name: 'Alice Smith',
          email: 'alice@example.com',
        },
      };

      const credential = await service.issueCredential(request);

      expect(credential).toBeDefined();
      expect(credential.id).toMatch(/^urn:uuid:/);
      expect(credential.type).toContain('VerifiableCredential');
      expect(credential.issuer).toBe(request.issuer);
      expect(credential.credentialSubject).toEqual(request.credentialSubject);
      expect(credential.issuanceDate).toBeDefined();
      expect(credential['@context']).toContain('https://www.w3.org/2018/credentials/v1');
    });

    it('should include a proof with the credential', async () => {
      const request: CreateCredentialRequest = {
        issuer: 'did:example:issuer123',
        credentialSubject: {
          id: 'did:example:holder456',
        },
      };

      const credential = await service.issueCredential(request);

      expect(credential.proof).toBeDefined();
      expect(credential.proof?.type).toBe('DataIntegrityProof');
      expect(credential.proof?.proofPurpose).toBe('assertionMethod');
      expect(credential.proof?.verificationMethod).toBe('did:example:issuer123#key-1');
      expect(credential.proof?.proofValue).toBeDefined();
    });

    it('should handle custom credential types', async () => {
      const request: CreateCredentialRequest = {
        issuer: 'did:example:issuer123',
        credentialSubject: {
          id: 'did:example:holder456',
          degree: 'Bachelor of Science',
        },
        type: ['VerifiableCredential', 'UniversityDegreeCredential'],
      };

      const credential = await service.issueCredential(request);

      expect(credential.type).toEqual(['VerifiableCredential', 'UniversityDegreeCredential']);
    });

    it('should include expiration date when provided', async () => {
      const expirationDate = '2025-12-31T23:59:59Z';
      const request: CreateCredentialRequest = {
        issuer: 'did:example:issuer123',
        credentialSubject: {
          id: 'did:example:holder456',
        },
        expirationDate,
      };

      const credential = await service.issueCredential(request);

      expect(credential.expirationDate).toBe(expirationDate);
    });

    it('should generate unique IDs for different credentials', async () => {
      const request: CreateCredentialRequest = {
        issuer: 'did:example:issuer123',
        credentialSubject: {
          id: 'did:example:holder456',
        },
      };

      const credential1 = await service.issueCredential(request);
      const credential2 = await service.issueCredential(request);

      expect(credential1.id).not.toBe(credential2.id);
    });
  });
});
