import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <Link
          to="/"
          className={`sidebar-link ${isActive('/') ? 'active' : ''}`}
        >
          <span className="sidebar-icon">🏠</span>
          <span className="sidebar-text">Home</span>
        </Link>
        <Link
          to="/credentials"
          className={`sidebar-link ${isActive('/credentials') ? 'active' : ''}`}
        >
          <span className="sidebar-icon">🎫</span>
          <span className="sidebar-text">Credentials</span>
        </Link>
        <Link
          to="/issue"
          className={`sidebar-link ${isActive('/issue') ? 'active' : ''}`}
        >
          <span className="sidebar-icon">✍️</span>
          <span className="sidebar-text">Issue</span>
        </Link>
        <Link
          to="/share"
          className={`sidebar-link ${isActive('/share') ? 'active' : ''}`}
        >
          <span className="sidebar-icon">🔗</span>
          <span className="sidebar-text">Share</span>
        </Link>
        <Link
          to="/documents"
          className={`sidebar-link ${isActive('/documents') ? 'active' : ''}`}
        >
          <span className="sidebar-icon">📄</span>
          <span className="sidebar-text">Documents</span>
        </Link>
        <Link
          to="/settings"
          className={`sidebar-link ${isActive('/settings') ? 'active' : ''}`}
        >
          <span className="sidebar-icon">⚙️</span>
          <span className="sidebar-text">Settings</span>
        </Link>
      </nav>
    </aside>
  );
}
