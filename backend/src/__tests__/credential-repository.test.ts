import { describe, it, expect, beforeEach } from 'vitest';
import { CredentialRepository } from '../infrastructure/credential-repository.js';
import type { VerifiableCredential } from '../types/credential.js';

describe('CredentialRepository', () => {
  let repository: CredentialRepository;

  const mockCredential: VerifiableCredential = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    id: 'urn:uuid:test-credential-123',
    type: ['VerifiableCredential'],
    issuer: 'did:example:issuer',
    issuanceDate: '2026-02-11T00:00:00Z',
    credentialSubject: {
      id: 'did:example:holder',
      name: 'Test Subject',
    },
    proof: {
      type: 'DataIntegrityProof',
      created: '2026-02-11T00:00:00Z',
      proofPurpose: 'assertionMethod',
      verificationMethod: 'did:example:issuer#key-1',
      proofValue: 'mockProofValue',
    },
  };

  beforeEach(async () => {
    repository = new CredentialRepository();
  });

  describe('save and findById', () => {
    it('should save and retrieve a credential by ID', async () => {
      await repository.save(mockCredential);

      const retrieved = await repository.findById(mockCredential.id);

      expect(retrieved).toEqual(mockCredential);
    });

    it('should return null for non-existent credential ID', async () => {
      const retrieved = await repository.findById('non-existent-id');

      expect(retrieved).toBeNull();
    });
  });

  describe('findByHolderId', () => {
    it('should retrieve credentials by holder ID', async () => {
      const holderId = 'did:example:holder123';

      const credential1: VerifiableCredential = {
        ...mockCredential,
        id: 'urn:uuid:cred-1',
        credentialSubject: { id: holderId },
      };

      const credential2: VerifiableCredential = {
        ...mockCredential,
        id: 'urn:uuid:cred-2',
        credentialSubject: { id: holderId },
      };

      await repository.save(credential1, holderId);
      await repository.save(credential2, holderId);

      const credentials = await repository.findByHolderId(holderId);

      expect(credentials).toHaveLength(2);
      expect(credentials).toContainEqual(credential1);
      expect(credentials).toContainEqual(credential2);
    });

    it('should return empty array for holder with no credentials', async () => {
      const credentials = await repository.findByHolderId('non-existent-holder');

      expect(credentials).toEqual([]);
    });
  });

  describe('findAll', () => {
    it('should retrieve all credentials', async () => {
      const credential1: VerifiableCredential = {
        ...mockCredential,
        id: 'urn:uuid:cred-1',
      };

      const credential2: VerifiableCredential = {
        ...mockCredential,
        id: 'urn:uuid:cred-2',
      };

      await repository.save(credential1);
      await repository.save(credential2);

      const credentials = await repository.findAll();

      expect(credentials).toHaveLength(2);
      expect(credentials).toContainEqual(credential1);
      expect(credentials).toContainEqual(credential2);
    });

    it('should return empty array when no credentials exist', async () => {
      const credentials = await repository.findAll();

      expect(credentials).toEqual([]);
    });
  });

  describe('clear', () => {
    it('should clear all credentials', async () => {
      await repository.save(mockCredential);

      let credentials = await repository.findAll();
      expect(credentials).toHaveLength(1);

      await repository.clear();

      credentials = await repository.findAll();
      expect(credentials).toEqual([]);
    });
  });
});
