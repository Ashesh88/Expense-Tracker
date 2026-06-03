import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CATEGORIES = [
  { name: 'Food', icon: '🍜' },
  { name: 'Transport', icon: '🚗' },
  { name: 'Shopping', icon: '🛍️' },
  { name: 'Bills', icon: '⚡' },
  { name: 'Entertainment', icon: '🎮' },
  { name: 'Other', icon: '📦' },
];

const AddExpense = ({ onExpenseAdded }) => {
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'Other', description: '' });
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/expenses', formData, {
        headers: { 'x-auth-token': token }
      });
      onExpenseAdded(res.data);
      setFormData({ title: '', amount: '', category: 'Other', description: '' });
    } catch (err) {
      alert('Error adding expense');
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        .add-card {
          background: white;
          border: 1px solid rgba(139,92,246,0.15);
          border-radius: 20px;
          padding: 1.75rem;
          box-shadow: 0 4px 24px rgba(124,58,237,0.08);
        }
        .add-card-header {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin-bottom: 1.5rem;
        }
        .add-card-icon {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #ede9fe, #fce7f3);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
        }
        .add-card-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e1b4b;
        }
        .form-row { margin-bottom: 1rem; }
        .form-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #6d6a8a;
          margin-bottom: 0.4rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .form-input {
          width: 100%;
          padding: 0.8rem 1rem;
          background: #faf9ff;
          border: 1.5px solid rgba(139,92,246,0.15);
          border-radius: 10px;
          color: #1e1b4b;
          font-size: 0.95rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
        }
        .form-input:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
          background: white;
        }
        .form-input::placeholder { color: #a8a5c0; }
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          margin-top: 0.4rem;
        }
        .cat-btn {
          background: #faf9ff;
          border: 1.5px solid rgba(139,92,246,0.12);
          border-radius: 10px;
          padding: 0.55rem 0.4rem;
          cursor: pointer;
          text-align: center;
          font-size: 0.75rem;
          color: #6d6a8a;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          font-weight: 500;
        }
        .cat-btn:hover { border-color: #8b5cf6; color: #7c3aed; background: #ede9fe; }
        .cat-btn.active {
          border-color: #7c3aed;
          background: linear-gradient(135deg, #ede9fe, #fce7f3);
          color: #7c3aed;
          font-weight: 600;
        }
        .cat-btn-icon { font-size: 1.15rem; }
        .submit-btn {
          width: 100%;
          padding: 0.9rem;
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          color: white;
          border: none;
          border-radius: 11px;
          font-size: 0.95rem;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
          margin-top: 0.5rem;
          box-shadow: 0 4px 16px rgba(124,58,237,0.25);
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(124,58,237,0.35);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
      <div className="add-card">
        <div className="add-card-header">
          <div className="add-card-icon">➕</div>
          <span className="add-card-title">Add Expense</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="form-label">Title</label>
            <input className="form-input" type="text" placeholder="What did you spend on?"
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div className="form-row">
            <label className="form-label">Amount (₹)</label>
            <input className="form-input" type="number" placeholder="0.00"
              value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
          </div>
          <div className="form-row">
            <label className="form-label">Category</label>
            <div className="cat-grid">
              {CATEGORIES.map(cat => (
                <button type="button" key={cat.name}
                  className={`cat-btn ${formData.category === cat.name ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, category: cat.name})}>
                  <span className="cat-btn-icon">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          <div className="form-row">
            <label className="form-label">Note (optional)</label>
            <input className="form-input" type="text" placeholder="Any details..."
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? 'Adding...' : '+ Add Expense'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddExpense;
