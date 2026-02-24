import { createHash, generateKeyPairSync, createPrivateKey, createPublicKey, randomBytes } from 'crypto';
import type { KeyObject, webcrypto } from 'crypto';
import { SignJWT, jwtVerify } from 'jose';
import type { EmployeeCredentialRequest } from '../types/credentials';
import { EMPLOYEE_VCT_URI } from './employeeCredentialService';

const ISSUER_URI = process.env.ISSUER_URI ?? 'https://businesswallet.example.com';

/**
 * Initialises the issuer key pair.
 *
 * Uses the PEM-encoded private key from the ISSUER_PRIVATE_KEY_PEM environment
 * variable when set (production). Falls back to an ephemeral ES256 key pair
 * generated at process startup (development / test).
 */
function initializeKeyPair(): { privateKey: KeyObject; publicKey: KeyObject } {
  const privKeyPem = process.env.ISSUER_PRIVATE_KEY_PEM;
  if (privKeyPem !== undefined && privKeyPem.length > 0) {
    const privKey = createPrivateKey(privKeyPem);
    return { privateKey: privKey, publicKey: createPublicKey(privKey) };
  }
  return generateKeyPairSync('ec', { namedCurve: 'P-256' });
}

const { privateKey: issuerPrivateKey, publicKey: issuerPublicKey } = initializeKeyPair();

function generateSalt(): string {
  return randomBytes(16).toString('base64url');
}

interface DisclosureEntry {
  readonly disclosure: string;
  readonly hash: string;
}

/**
 * Creates a single SD-JWT disclosure for the given claim key/value pair.
 *
 * Disclosure format (SD-JWT spec §5.2):  base64url( JSON([salt, key, value]) )
 */
function createDisclosure(key: string, value: string): DisclosureEntry {
  const salt = generateSalt();
  const disclosureJson = JSON.stringify([salt, key, value]);
  const disclosure = Buffer.from(disclosureJson).toString('base64url');
  const hash = createHash('sha256').update(disclosure).digest('base64url');
  return { disclosure, hash };
}

/** Result returned by {@link verifyEmployeeCredentialSdJwt}. */
export interface EmployeeVerificationResult {
  /** The `vct` claim from the verified credential. */
  readonly vct: string;
  /** The `iss` claim from the verified credential. */
  readonly iss: string;
  /** The `iat` claim (issuance time) from the verified credential. */
  readonly iat: number;
  /** Claims that were selectively disclosed in the presented SD-JWT. */
  readonly disclosedClaims: Readonly<Record<string, string>>;
}

/**
 * Returns the issuer's public key as a JSON Web Key for publication in a JWKS
 * endpoint. Use: signature verification (`"use": "sig"`).
 */
export function getIssuerPublicKeyJwk(): webcrypto.JsonWebKey {
  return issuerPublicKey.export({ format: 'jwk' });
}

/**
 * Issues an Employee credential as a compact SD-JWT VC.
 *
 * All claims are individually wrapped as selective disclosures so that the
 * holder can selectively reveal them to verifiers (FR-0008, TR-0009).
 *
 * The returned string follows the SD-JWT compact serialisation:
 *   `<jwt>~<disclosure1>~…~<disclosureN>~`
 */
export async function issueEmployeeCredentialSdJwt(
  request: EmployeeCredentialRequest,
): Promise<string> {
  const claimEntries: Array<[string, string]> = [
    ['firstName', request.firstName],
    ['lastName', request.lastName],
    ['jobTitle', request.jobTitle],
    ['startDate', request.startDate],
  ];
  if (request.endDate !== undefined) {
    claimEntries.push(['endDate', request.endDate]);
  }

  const disclosures: string[] = [];
  const sdHashes: string[] = [];

  for (const [key, value] of claimEntries) {
    const entry = createDisclosure(key, value);
    disclosures.push(entry.disclosure);
    sdHashes.push(entry.hash);
  }

  const now = Math.floor(Date.now() / 1000);

  const jwt = await new SignJWT({
    vct: EMPLOYEE_VCT_URI,
    iss: ISSUER_URI,
    iat: now,
    _sd_alg: 'sha-256',
    _sd: sdHashes,
  })
    .setProtectedHeader({ alg: 'ES256', typ: 'vc+sd-jwt' })
    .sign(issuerPrivateKey);

  // Compact SD-JWT serialisation: JWT ~ disc1 ~ disc2 ~ … ~ discN ~
  return [jwt, ...disclosures, ''].join('~');
}

/**
 * Verifies an Employee SD-JWT VC and returns the set of selectively disclosed
 * claims.
 *
 * Validation steps performed:
 *  1. The JWT signature is verified against the issuer's public key.
 *  2. Each presented disclosure's SHA-256 hash is confirmed to appear in the
 *     JWT's `_sd` array (tamper detection).
 *  3. Each disclosure is decoded and its claim extracted.
 *
 * @throws {Error} on invalid signature, unknown disclosure hash, or malformed
 *   disclosure encoding.
 */
export async function verifyEmployeeCredentialSdJwt(
  sdJwt: string,
): Promise<EmployeeVerificationResult> {
  const parts = sdJwt.split('~');
  const jwtPart = parts[0];
  if (!jwtPart) {
    throw new Error('Invalid SD-JWT format: missing JWT component');
  }

  // Filter empty strings (e.g. trailing separator)
  const disclosureParts = parts.slice(1).filter((d) => d.length > 0);

  const { payload } = await jwtVerify(jwtPart, issuerPublicKey, {
    typ: 'vc+sd-jwt',
  });

  // Narrow custom claims from the generic JWTPayload (which has [key]: unknown)
  const sdValue = payload['_sd'];
  const sdHashes: string[] = Array.isArray(sdValue)
    ? sdValue.filter((h): h is string => typeof h === 'string')
    : [];

  const disclosedClaims: Record<string, string> = {};

  for (const disclosure of disclosureParts) {
    const hash = createHash('sha256').update(disclosure).digest('base64url');
    if (!sdHashes.includes(hash)) {
      throw new Error('Disclosure hash not found in credential _sd array');
    }

    let decoded: unknown;
    try {
      decoded = JSON.parse(Buffer.from(disclosure, 'base64url').toString('utf8'));
    } catch {
      throw new Error('Failed to decode disclosure: invalid base64url or JSON');
    }

    if (!Array.isArray(decoded) || decoded.length < 3) {
      throw new Error('Disclosure must be a JSON array with at least 3 elements [salt, key, value]');
    }

    const claimKey = decoded[1];
    const claimValue = decoded[2];

    if (typeof claimKey !== 'string') {
      throw new Error('Disclosure claim name must be a string');
    }
    if (typeof claimValue !== 'string') {
      throw new Error('Disclosure claim value must be a string');
    }

    disclosedClaims[claimKey] = claimValue;
  }

  const vctValue = payload['vct'];
  const issValue = payload['iss'];
  const iatValue = payload['iat'];

  return {
    vct: typeof vctValue === 'string' ? vctValue : '',
    iss: typeof issValue === 'string' ? issValue : '',
    iat: typeof iatValue === 'number' ? iatValue : 0,
    disclosedClaims,
  };
}
