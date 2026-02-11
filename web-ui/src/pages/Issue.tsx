import './Page.css';

export default function Issue() {
  return (
    <div className="issue">
      <h2 className="page-title">Issue Credentials</h2>
      <p className="page-description">
        Create and issue verifiable credentials to subjects.
      </p>

      <div className="placeholder">
        <div className="placeholder-icon">✍️</div>
        <h3 className="placeholder-title">Issue New Credential</h3>
        <p className="placeholder-text">
          This functionality will allow you to issue W3C Verifiable Credentials
          to individuals, organizations, and entities.
        </p>
      </div>
    </div>
  );
}
