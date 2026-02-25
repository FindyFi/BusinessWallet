import { useState } from 'react';
import { useIssueEmployeeCredential } from '../hooks/useIssueEmployeeCredential';
import './Page.css';
import './Issue.css';

/** ISO 8601 date string pattern YYYY-MM-DD */
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

interface FormFields {
  firstName: string;
  lastName: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  startDate?: string;
  endDate?: string;
}

function validateForm(fields: FormFields): FormErrors {
  const errors: FormErrors = {};

  if (!fields.firstName.trim()) {
    errors.firstName = 'First name is required.';
  }
  if (!fields.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  }
  if (!fields.jobTitle.trim()) {
    errors.jobTitle = 'Job title is required.';
  }
  if (!fields.startDate.trim()) {
    errors.startDate = 'Start date is required.';
  } else if (!DATE_PATTERN.test(fields.startDate)) {
    errors.startDate = 'Start date must be in YYYY-MM-DD format.';
  }
  if (fields.endDate.trim() && !DATE_PATTERN.test(fields.endDate)) {
    errors.endDate = 'End date must be in YYYY-MM-DD format.';
  }

  return errors;
}

export default function Issue() {
  const { issueCredential, isLoading, credential, error, reset } =
    useIssueEmployeeCredential();

  const [fields, setFields] = useState<FormFields>({
    firstName: '',
    lastName: '',
    jobTitle: '',
    startDate: '',
    endDate: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear the error for the field as the user types
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateForm(fields);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const requestData = {
      firstName: fields.firstName.trim(),
      lastName: fields.lastName.trim(),
      jobTitle: fields.jobTitle.trim(),
      startDate: fields.startDate.trim(),
      ...(fields.endDate.trim() ? { endDate: fields.endDate.trim() } : {}),
    };

    await issueCredential(requestData);
  };

  const handleIssueAgain = () => {
    setFields({
      firstName: '',
      lastName: '',
      jobTitle: '',
      startDate: '',
      endDate: '',
    });
    setFieldErrors({});
    reset();
  };

  if (credential) {
    return (
      <div className="issue">
        <h2 className="page-title">Issue Credentials</h2>
        <p className="page-description">
          Create and issue verifiable credentials to subjects.
        </p>

        <div className="success-section" role="status" aria-live="polite">
          <h3 className="success-title">✅ Credential Issued Successfully</h3>
          <label htmlFor="credential-output">
            Issued SD-JWT VC (copy and share with the employee):
          </label>
          <textarea
            id="credential-output"
            className="credential-textarea"
            readOnly
            value={credential.credential}
            aria-label="Issued credential in compact SD-JWT VC format"
          />
          <button
            type="button"
            className="issue-again-button"
            onClick={handleIssueAgain}
          >
            Issue Another Credential
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="issue">
      <h2 className="page-title">Issue Credentials</h2>
      <p className="page-description">
        Create and issue verifiable credentials to subjects.
      </p>

      <form
        className="issue-form"
        onSubmit={(e) => void handleSubmit(e)}
        noValidate
        aria-label="Issue employee credential"
      >
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">
            First Name{' '}
            <span className="required-mark" aria-hidden="true">
              *
            </span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="form-input"
            value={fields.firstName}
            onChange={handleChange}
            autoComplete="given-name"
            aria-required="true"
            aria-describedby={
              fieldErrors.firstName ? 'firstName-error' : undefined
            }
            aria-invalid={fieldErrors.firstName ? 'true' : undefined}
          />
          {fieldErrors.firstName && (
            <span id="firstName-error" className="field-error" role="alert">
              {fieldErrors.firstName}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName" className="form-label">
            Last Name{' '}
            <span className="required-mark" aria-hidden="true">
              *
            </span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="form-input"
            value={fields.lastName}
            onChange={handleChange}
            autoComplete="family-name"
            aria-required="true"
            aria-describedby={
              fieldErrors.lastName ? 'lastName-error' : undefined
            }
            aria-invalid={fieldErrors.lastName ? 'true' : undefined}
          />
          {fieldErrors.lastName && (
            <span id="lastName-error" className="field-error" role="alert">
              {fieldErrors.lastName}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="jobTitle" className="form-label">
            Job Title{' '}
            <span className="required-mark" aria-hidden="true">
              *
            </span>
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            className="form-input"
            value={fields.jobTitle}
            onChange={handleChange}
            autoComplete="organization-title"
            aria-required="true"
            aria-describedby={
              fieldErrors.jobTitle ? 'jobTitle-error' : undefined
            }
            aria-invalid={fieldErrors.jobTitle ? 'true' : undefined}
          />
          {fieldErrors.jobTitle && (
            <span id="jobTitle-error" className="field-error" role="alert">
              {fieldErrors.jobTitle}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="startDate" className="form-label">
            Start Date{' '}
            <span className="required-mark" aria-hidden="true">
              *
            </span>
          </label>
          <input
            type="text"
            id="startDate"
            name="startDate"
            className="form-input"
            value={fields.startDate}
            onChange={handleChange}
            placeholder="YYYY-MM-DD"
            aria-required="true"
            aria-describedby={
              fieldErrors.startDate ? 'startDate-error' : undefined
            }
            aria-invalid={fieldErrors.startDate ? 'true' : undefined}
          />
          {fieldErrors.startDate && (
            <span id="startDate-error" className="field-error" role="alert">
              {fieldErrors.startDate}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="endDate" className="form-label">
            End Date
          </label>
          <input
            type="text"
            id="endDate"
            name="endDate"
            className="form-input"
            value={fields.endDate}
            onChange={handleChange}
            placeholder="YYYY-MM-DD (optional)"
            aria-describedby={fieldErrors.endDate ? 'endDate-error' : undefined}
            aria-invalid={fieldErrors.endDate ? 'true' : undefined}
          />
          {fieldErrors.endDate && (
            <span id="endDate-error" className="field-error" role="alert">
              {fieldErrors.endDate}
            </span>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? 'Issuing…' : 'Issue Credential'}
          </button>
        </div>

        {error && (
          <div className="api-error" role="alert" aria-live="assertive">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
