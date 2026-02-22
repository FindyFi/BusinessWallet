import { Router, type Request, type Response } from 'express';
import { EMPLOYEE_VC_TYPE_METADATA } from '../services/employeeCredentialService';
import { issueEmployeeCredential } from '../agent/CredoAgent';
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
 * Issues a cryptographically-signed SD-JWT VC employee credential using Credo (AC-0013).
 */
credentialsRouter.post(
  '/employee',
  async (req: Request, res: Response<EmployeeCredentialResponse | ErrorResponse>): Promise<void> => {
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

    try {
      const credential = await issueEmployeeCredential(credentialRequest);
      res.status(201).json({ credential, format: 'vc+sd-jwt' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Credential issuance failed';
      res.status(500).json({ error: 'ISSUANCE_ERROR', message });
    }
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
