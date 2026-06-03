import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        .auth-page {
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .auth-card {
          width: 100%;
          max-width: 420px;
          background: white;
          border: 1px solid rgba(139,92,246,0.15);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 8px 40px rgba(124,58,237,0.12);
          animation: fadeUp 0.4s ease;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .auth-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #ede9fe;
          color: #7c3aed;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.3rem 0.75rem;
          border-radius: 99px;
          margin-bottom: 1rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .auth-title {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: #1e1b4b;
          margin-bottom: 0.4rem;
          line-height: 1.15;
        }
        .auth-sub { color: #6d6a8a; font-size: 0.9rem; margin-bottom: 2rem; }
        .auth-divider { height: 1px; background: rgba(139,92,246,0.1); margin: 1.5rem 0; }
        .auth-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          color: #6d6a8a;
          margin-bottom: 0.4rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .auth-input {
          width: 100%;
          padding: 0.85rem 1rem;
          background: #faf9ff;
          border: 1.5px solid rgba(139,92,246,0.18);
          border-radius: 11px;
          color: #1e1b4b;
          font-size: 0.95rem;
          font-family: 'DM Sans', sans-serif;
          margin-bottom: 1.2rem;
          outline: none;
        }
        .auth-input:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
          background: white;
        }
        .auth-input::placeholder { color: #a8a5c0; }
        .auth-btn {
          width: 100%;
          padding: 0.9rem;
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          color: white;
          border: none;
          border-radius: 11px;
          font-size: 1rem;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
          margin-top: 0.5rem;
          box-shadow: 0 4px 18px rgba(124,58,237,0.28);
        }
        .auth-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(124,58,237,0.38);
        }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-footer { text-align: center; margin-top: 1.5rem; color: #6d6a8a; font-size: 0.875rem; }
        .auth-footer a { color: #7c3aed; text-decoration: none; font-weight: 600; }
        .auth-footer a:hover { color: #5b21b6; }
      `}</style>
      <div className="auth-page">
        <div className="auth-card">
          <span className="auth-badge">👋 Welcome back</span>
          <h2 className="auth-title">Sign in to<br/>your account</h2>
          <p className="auth-sub">Track every rupee, effortlessly.</p>
          <div className="auth-divider"></div>
          <form onSubmit={handleSubmit}>
            <label className="auth-label">Email</label>
            <input className="auth-input" type="email" placeholder="you@example.com"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            <label className="auth-label">Password</label>
            <input className="auth-input" type="password" placeholder="••••••••"
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
          <p className="auth-footer">New here? <Link to="/register">Create an account</Link></p>
        </div>
      </div>
    </>
  );
};

export default Login;
