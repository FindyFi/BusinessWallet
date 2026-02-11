import type { VerifiableCredential, StoredCredential } from '../types/credential.js';

/**
 * In-memory credential repository
 * This is a temporary implementation; production should use PostgreSQL
 */
export class CredentialRepository {
  private credentials: Map<string, StoredCredential>;

  constructor() {
    this.credentials = new Map();
  }

  /**
   * Stores a credential
   * @param credential - The credential to store
   * @param holderId - Optional holder identifier
   */
  async save(
    credential: VerifiableCredential,
    holderId?: string
  ): Promise<void> {
    const stored: StoredCredential = {
      credential,
      createdAt: new Date().toISOString(),
      holderId,
    };

    this.credentials.set(credential.id, stored);
  }

  /**
   * Retrieves a credential by ID
   * @param id - The credential ID
   * @returns The credential if found, null otherwise
   */
  async findById(id: string): Promise<VerifiableCredential | null> {
    const stored = this.credentials.get(id);
    return stored ? stored.credential : null;
  }

  /**
   * Retrieves all credentials for a holder
   * @param holderId - The holder identifier
   * @returns Array of credentials
   */
  async findByHolderId(holderId: string): Promise<VerifiableCredential[]> {
    const results: VerifiableCredential[] = [];

    for (const stored of this.credentials.values()) {
      if (stored.holderId === holderId) {
        results.push(stored.credential);
      }
    }

    return results;
  }

  /**
   * Retrieves all credentials
   * @returns Array of all credentials
   */
  async findAll(): Promise<VerifiableCredential[]> {
    const results: VerifiableCredential[] = [];

    for (const stored of this.credentials.values()) {
      results.push(stored.credential);
    }

    return results;
  }

  /**
   * Clears all credentials (useful for testing)
   */
  async clear(): Promise<void> {
    this.credentials.clear();
  }
}
