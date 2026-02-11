import './Page.css';

export default function Share() {
  return (
    <div className="share">
      <h2 className="page-title">Share Credentials</h2>
      <p className="page-description">
        Share verified credentials with third parties using selective
        disclosure.
      </p>

      <div className="placeholder">
        <div className="placeholder-icon">🔗</div>
        <h3 className="placeholder-title">Share Your Credentials</h3>
        <p className="placeholder-text">
          This functionality will allow you to share your verifiable credentials
          with third parties while maintaining control over what information is
          disclosed.
        </p>
      </div>
    </div>
  );
}
