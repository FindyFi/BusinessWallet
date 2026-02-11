import './Credentials.css';

export default function Credentials() {
  return (
    <div className="credentials">
      <h2 className="page-title">Credentials</h2>
      <p className="page-description">
        Manage your verifiable credentials and documents.
      </p>

      <div className="credentials-placeholder">
        <div className="placeholder-icon">🎫</div>
        <h3 className="placeholder-title">No Credentials Yet</h3>
        <p className="placeholder-text">
          This is a placeholder for the credentials management interface. Future
          functionality will include:
        </p>
        <ul className="placeholder-list">
          <li>View all stored credentials</li>
          <li>Issue new credentials to subjects</li>
          <li>Share credentials with third parties</li>
          <li>Request credentials from others</li>
          <li>Verify credential authenticity</li>
          <li>Manage credential lifecycle and status</li>
        </ul>
      </div>
    </div>
  );
}
