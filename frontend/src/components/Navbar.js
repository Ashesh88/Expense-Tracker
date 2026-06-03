import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2.5rem;
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(139,92,246,0.12);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 16px rgba(124,58,237,0.07);
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
          color: #1e1b4b;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.3rem;
        }
        .brand-icon {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, #7c3aed, #ec4899);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
          box-shadow: 0 4px 12px rgba(124,58,237,0.3);
        }
        .navbar-actions { display: flex; gap: 0.75rem; align-items: center; }
        .nav-link {
          color: #6d6a8a;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 8px;
        }
        .nav-link:hover { color: #7c3aed; background: #ede9fe; }
        .nav-btn-primary {
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          color: white;
          border: none;
          padding: 0.5rem 1.3rem;
          border-radius: 9px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          display: inline-block;
          box-shadow: 0 4px 12px rgba(124,58,237,0.25);
        }
        .nav-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(124,58,237,0.35); }
        .nav-btn-logout {
          background: transparent;
          color: #6d6a8a;
          border: 1.5px solid rgba(139,92,246,0.2);
          padding: 0.5rem 1.2rem;
          border-radius: 9px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-btn-logout:hover { color: #ef4444; border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.05); }
      `}</style>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">💸</div>
          Spendly
        </Link>
        <div className="navbar-actions">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="nav-btn-logout">Logout</button>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
