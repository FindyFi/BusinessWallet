import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <div className="logo">BW</div>
            <h1 className="title">Business Wallet</h1>
          </div>
          <div className="user-section">
            <span className="user-name">Organization Admin</span>
            <div className="user-avatar">OA</div>
          </div>
        </div>
      </header>
      <div className="content-wrapper">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <footer className="footer">
        <p>&copy; 2026 Business Wallet. All rights reserved.</p>
      </footer>
    </div>
  );
}
