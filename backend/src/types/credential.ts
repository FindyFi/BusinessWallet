/**
 * Basic credential type following W3C Verifiable Credentials Data Model
 * This is a simplified version for initial implementation
 */

export interface CredentialSubject {
  id?: string;
  [key: string]: unknown;
}

export interface CredentialProof {
  type: string;
  created: string;
  proofPurpose: string;
  verificationMethod: string;
  proofValue: string;
}

export interface VerifiableCredential {
  '@context': string[];
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: CredentialSubject;
  proof?: CredentialProof;
}

export interface CreateCredentialRequest {
  issuer: string;
  credentialSubject: CredentialSubject;
  expirationDate?: string;
  type?: string[];
}

export interface StoredCredential {
  credential: VerifiableCredential;
  createdAt: string;
  holderId?: string;
}
