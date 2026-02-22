import { Router, type Request, type Response } from 'express';
import { EMPLOYEE_VC_TYPE_METADATA } from '../services/employeeCredentialService';
import type {
  EmployeeCredentialRequest,
  EmployeeCredentialResponse,
  ErrorResponse,
} from '../types/credentials';

export const credentialsRouter = Router();

/** ISO 8601 date pattern: YYYY-MM-DD */
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates that a value is a non-empty string.
 */
function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates that a string value matches the ISO 8601 date format (YYYY-MM-DD) and
 * represents a real calendar date (e.g. rejects 2024-02-30 which JavaScript's Date
 * constructor would silently roll over to 2024-03-01).
 */
function isIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(value);
  return (
    !isNaN(date.getTime()) &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
}

/**
 * POST /credentials/employee
 *
 * Issues an SD-JWT VC employee credential for the given employee data.
 *
 * Authentication and full cryptographic signing via the Credo framework (AC-0013)
 * are required before this endpoint is ready for production use.
 */
credentialsRouter.post(
  '/employee',
  (req: Request, res: Response<EmployeeCredentialResponse | ErrorResponse>): void => {
    const body = req.body as Record<string, unknown>;

    // Validate required string fields
    const requiredFields: Array<keyof EmployeeCredentialRequest> = [
      'firstName',
      'lastName',
      'jobTitle',
      'startDate',
    ];
    for (const field of requiredFields) {
      if (!isNonEmptyString(body[field])) {
        res.status(400).json({
          error: 'VALIDATION_ERROR',
          message: `Missing or invalid required field: ${field}`,
        });
        return;
      }
    }

    // At this point we know the required string fields are present
    const firstName = body['firstName'] as string;
    const lastName = body['lastName'] as string;
    const jobTitle = body['jobTitle'] as string;
    const startDate = body['startDate'] as string;

    if (!isIsoDate(startDate)) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'startDate must be a valid ISO 8601 date (YYYY-MM-DD)',
      });
      return;
    }

    let endDate: string | undefined;
    if (body['endDate'] !== undefined) {
      if (!isNonEmptyString(body['endDate'])) {
        res.status(400).json({
          error: 'VALIDATION_ERROR',
          message: 'endDate must be a non-empty string when provided',
        });
        return;
      }
      endDate = body['endDate'] as string;
      if (!isIsoDate(endDate)) {
        res.status(400).json({
          error: 'VALIDATION_ERROR',
          message: 'endDate must be a valid ISO 8601 date (YYYY-MM-DD)',
        });
        return;
      }
    }

    const credentialRequest: EmployeeCredentialRequest = {
      firstName,
      lastName,
      jobTitle,
      startDate,
      ...(endDate !== undefined ? { endDate } : {}),
    };

    // TODO: Replace stub with full SD-JWT VC issuance via Credo (AC-0013) once
    // key management and the credential signing pipeline are integrated.
    const credential = issueEmployeeCredentialStub(credentialRequest);

    res.status(201).json({ credential, format: 'vc+sd-jwt' });
  },
);

/**
 * GET /.well-known/vct/employee
 *
 * Returns the SD-JWT VC Type Metadata document for the employee credential type.
 * Mounted at /.well-known/vct/employee in the application root.
 */
export function employeeVcTypeMetadataHandler(_req: Request, res: Response): void {
  res.status(200).json(EMPLOYEE_VC_TYPE_METADATA);
}

/**
 * Stub implementation for employee credential issuance.
 *
 * Returns a placeholder compact SD-JWT VC string that demonstrates the API contract.
 * Production implementation must replace this with Credo-based cryptographic signing.
 */
function issueEmployeeCredentialStub(request: EmployeeCredentialRequest): string {
  // Construct a minimal unsigned payload for demonstration purposes.
  // A real implementation would use Credo to sign this with the issuer's key.
  const payload = {
    vct: EMPLOYEE_VC_TYPE_METADATA.vct,
    firstName: request.firstName,
    lastName: request.lastName,
    jobTitle: request.jobTitle,
    startDate: request.startDate,
    ...(request.endDate !== undefined ? { endDate: request.endDate } : {}),
    iss: 'https://businesswallet.example.com',
    iat: Math.floor(Date.now() / 1000),
  };
  const header = Buffer.from(JSON.stringify({ alg: 'ES256', typ: 'vc+sd-jwt' })).toString(
    'base64url',
  );
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  // Placeholder signature — not cryptographically valid.
  return `${header}.${body}.UNSIGNED`;
}
