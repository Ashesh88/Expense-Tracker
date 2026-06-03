import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AddExpense from './AddExpense';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#7c3aed', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#8b5cf6'];
const CAT_ICONS = { Food:'🍜', Transport:'🚗', Shopping:'🛍️', Bills:'⚡', Entertainment:'🎮', Other:'📦' };

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/expenses', {
          headers: { 'x-auth-token': token }
        });
        setExpenses(res.data);
      } catch (err) { console.error(err); }
    };
    fetchExpenses();
  }, [token]);

  const handleExpenseAdded = (expense) => setExpenses([expense, ...expenses]);
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setExpenses(expenses.filter(e => e._id !== id));
    } catch (err) { alert('Error deleting expense'); }
  };

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const thisMonth = expenses.filter(e => new Date(e.date).getMonth() === new Date().getMonth());
  const monthTotal = thisMonth.reduce((sum, e) => sum + e.amount, 0);
  const categoryData = expenses.reduce((acc, e) => {
    const existing = acc.find(item => item.name === e.category);
    if (existing) existing.value += e.amount;
    else acc.push({ name: e.category, value: e.amount });
    return acc;
  }, []);
  const topCategory = [...categoryData].sort((a,b) => b.value - a.value)[0];

  return (
    <>
      <style>{`
        .dash-wrap { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem; }

        .dash-hero {
          background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #ec4899 100%);
          border-radius: 24px;
          padding: 2rem 2.5rem;
          margin-bottom: 1.75rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(124,58,237,0.3);
        }
        .dash-hero::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 200px; height: 200px;
          background: rgba(255,255,255,0.06);
          border-radius: 50%;
        }
        .dash-hero::after {
          content: '';
          position: absolute;
          bottom: -60px; right: 80px;
          width: 160px; height: 160px;
          background: rgba(255,255,255,0.04);
          border-radius: 50%;
        }
        .dash-hero-label {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.4rem;
        }
        .dash-hero-amount {
          font-family: 'Syne', sans-serif;
          font-size: 3rem;
          font-weight: 800;
          color: white;
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .dash-hero-sub { color: rgba(255,255,255,0.65); font-size: 0.9rem; }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.75rem;
        }
        .stat-card {
          background: white;
          border: 1px solid rgba(139,92,246,0.12);
          border-radius: 18px;
          padding: 1.3rem 1.5rem;
          box-shadow: 0 2px 12px rgba(124,58,237,0.06);
        }
        .stat-label {
          font-size: 0.75rem;
          color: #6d6a8a;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e1b4b;
          line-height: 1;
        }
        .stat-value.purple { color: #7c3aed; }
        .stat-value.pink { color: #ec4899; }
        .stat-sub { font-size: 0.75rem; color: #a8a5c0; margin-top: 0.3rem; }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 768px) {
          .main-grid { grid-template-columns: 1fr; }
          .stats-row { grid-template-columns: 1fr; }
          .dash-hero-amount { font-size: 2.2rem; }
        }

        .card {
          background: white;
          border: 1px solid rgba(139,92,246,0.12);
          border-radius: 20px;
          padding: 1.75rem;
          box-shadow: 0 2px 12px rgba(124,58,237,0.06);
        }
        .card-title {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #1e1b4b;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .card-title-pill {
          width: 24px; height: 6px;
          background: linear-gradient(90deg, #7c3aed, #ec4899);
          border-radius: 99px;
        }

        .expense-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.85rem 0;
          border-bottom: 1px solid rgba(139,92,246,0.07);
        }
        .expense-item:last-child { border-bottom: none; }
        .expense-left { display: flex; align-items: center; gap: 0.9rem; }
        .expense-icon-wrap {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #ede9fe, #fce7f3);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .expense-name { font-weight: 600; color: #1e1b4b; font-size: 0.9rem; }
        .expense-meta { font-size: 0.75rem; color: #a8a5c0; margin-top: 0.1rem; }
        .expense-right { display: flex; align-items: center; gap: 0.75rem; }
        .expense-amount {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          color: #7c3aed;
        }
        .del-btn {
          background: none; border: none; cursor: pointer;
          width: 28px; height: 28px;
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          color: #a8a5c0; font-size: 0.8rem;
        }
        .del-btn:hover { background: #fff0f0; color: #ef4444; }

        .empty-state { text-align: center; padding: 2.5rem 1rem; color: #a8a5c0; }
        .empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }

        .tooltip-box {
          background: white;
          border: 1px solid rgba(139,92,246,0.15);
          border-radius: 10px;
          padding: 0.6rem 0.9rem;
          font-size: 0.85rem;
          color: #1e1b4b;
          box-shadow: 0 4px 16px rgba(124,58,237,0.1);
        }
      `}</style>

      <div className="dash-wrap">
        <div className="dash-hero">
          <p className="dash-hero-label">Total Spent</p>
          <p className="dash-hero-amount">₹{totalAmount.toLocaleString()}</p>
          <p className="dash-hero-sub">{expenses.length} transactions recorded</p>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <p className="stat-label">This Month</p>
            <p className="stat-value purple">₹{monthTotal.toLocaleString()}</p>
            <p className="stat-sub">{thisMonth.length} transactions</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Top Category</p>
            <p className="stat-value" style={{fontSize:'1.1rem'}}>
              {topCategory ? `${CAT_ICONS[topCategory.name] || '📦'} ${topCategory.name}` : '—'}
            </p>
            <p className="stat-sub">{topCategory ? `₹${topCategory.value.toLocaleString()}` : 'No data'}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Avg. per expense</p>
            <p className="stat-value pink">
              {expenses.length > 0 ? `₹${Math.round(totalAmount / expenses.length).toLocaleString()}` : '—'}
            </p>
            <p className="stat-sub">across all categories</p>
          </div>
        </div>

        <div className="main-grid">
          <AddExpense onExpenseAdded={handleExpenseAdded} />
          <div className="card">
            <p className="card-title"><span className="card-title-pill"></span>Spending Breakdown</p>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={({active, payload}) => active && payload?.length ? (
                    <div className="tooltip-box">
                      {payload[0].name}: <strong>₹{payload[0].value.toLocaleString()}</strong>
                    </div>
                  ) : null} />
                  <Legend formatter={(v) => <span style={{color:'#6d6a8a',fontSize:'0.8rem'}}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <p>Add expenses to see your breakdown</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <p className="card-title"><span className="card-title-pill"></span>Recent Transactions</p>
          {expenses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💸</div>
              <p>No expenses yet — add your first one!</p>
            </div>
          ) : (
            expenses.map(expense => (
              <div key={expense._id} className="expense-item">
                <div className="expense-left">
                  <div className="expense-icon-wrap">{CAT_ICONS[expense.category] || '📦'}</div>
                  <div>
                    <p className="expense-name">{expense.title}</p>
                    <p className="expense-meta">
                      {expense.category} · {new Date(expense.date).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}
                    </p>
                  </div>
                </div>
                <div className="expense-right">
                  <span className="expense-amount">₹{expense.amount.toLocaleString()}</span>
                  <button className="del-btn" onClick={() => handleDelete(expense._id)}>✕</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
