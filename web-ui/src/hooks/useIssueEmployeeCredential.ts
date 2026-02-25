import { useState } from 'react';

/** Request body for issuing an employee credential. */
export interface EmployeeCredentialRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly jobTitle: string;
  readonly startDate: string;
  readonly endDate?: string;
}

/** Response body returned after successfully issuing an employee credential. */
export interface EmployeeCredentialResponse {
  readonly credential: string;
  readonly format: 'vc+sd-jwt';
}

interface UseIssueEmployeeCredentialResult {
  issueCredential: (data: EmployeeCredentialRequest) => Promise<void>;
  isLoading: boolean;
  credential: EmployeeCredentialResponse | null;
  error: string | null;
  reset: () => void;
}

/**
 * Custom hook that encapsulates the API call to POST /credentials/employee.
 * The base URL is read from the VITE_API_BASE_URL environment variable.
 */
export function useIssueEmployeeCredential(): UseIssueEmployeeCredentialResult {
  const [isLoading, setIsLoading] = useState(false);
  const [credential, setCredential] =
    useState<EmployeeCredentialResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setCredential(null);
    setError(null);
  };

  const issueCredential = async (
    data: EmployeeCredentialRequest
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setCredential(null);

    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

    try {
      const response = await fetch(`${baseUrl}/credentials/employee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let message = `Request failed with status ${response.status}`;
        try {
          const body = (await response.json()) as { message?: string };
          if (body.message) {
            message = body.message;
          }
        } catch {
          // use default message if body is not JSON
        }
        setError(message);
        return;
      }

      const result = (await response.json()) as EmployeeCredentialResponse;
      setCredential(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { issueCredential, isLoading, credential, error, reset };
}
