import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h2 className="hero-title">Welcome to Business Wallet</h2>
        <p className="hero-description">
          A digital wallet system for organizations to issue, store, share, and
          request verifiable credentials and documents.
        </p>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">🎫</div>
          <h3 className="feature-title">Issue Credentials</h3>
          <p className="feature-description">
            Create and issue W3C Verifiable Credentials to individuals,
            organizations, and entities.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3 className="feature-title">Secure Storage</h3>
          <p className="feature-description">
            Store credentials and documents securely with multi-tenant data
            isolation.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔗</div>
          <h3 className="feature-title">Share & Request</h3>
          <p className="feature-description">
            Share verified credentials with third parties and request
            credentials from others.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📄</div>
          <h3 className="feature-title">Registered Delivery</h3>
          <p className="feature-description">
            Transmit and receive electronic documents through registered
            delivery services.
          </p>
        </div>
      </div>
    </div>
  );
}
