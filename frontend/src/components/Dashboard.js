import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AddExpense from './AddExpense';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#4f46e5', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#0891b2'];

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
      } catch (err) {
        console.error(err);
      }
    };
    fetchExpenses();
  }, [token]);

  const handleExpenseAdded = (expense) => {
    setExpenses([expense, ...expenses]);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setExpenses(expenses.filter(e => e._id !== id));
    } catch (err) {
      alert('Error deleting expense');
    }
  };

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryData = expenses.reduce((acc, e) => {
    const existing = acc.find(item => item.name === e.category);
    if (existing) existing.value += e.amount;
    else acc.push({ name: e.category, value: e.amount });
    return acc;
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Dashboard</h2>
        <div style={styles.totalCard}>
          <p style={styles.totalLabel}>Total Spent</p>
          <p style={styles.totalAmount}>₹{totalAmount.toLocaleString()}</p>
        </div>
      </div>

      <div style={styles.grid}>
        <AddExpense onExpenseAdded={handleExpenseAdded} />

        {categoryData.length > 0 && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Spending by Category</h3>
            <ResponsiveContainer width='100%' height={250}>
              <PieChart>
                <Pie data={categoryData} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius={80}>
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Recent Expenses</h3>
        {expenses.length === 0 ? (
          <p style={styles.empty}>No expenses yet. Add your first expense!</p>
        ) : (
          expenses.map(expense => (
            <div key={expense._id} style={styles.expenseItem}>
              <div>
                <p style={styles.expenseTitle}>{expense.title}</p>
                <p style={styles.expenseMeta}>{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
              </div>
              <div style={styles.expenseRight}>
                <p style={styles.expenseAmount}>₹{expense.amount.toLocaleString()}</p>
                <button onClick={() => handleDelete(expense._id)} style={styles.deleteBtn}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title: { color: '#1f2937', fontSize: '1.8rem' },
  totalCard: { backgroundColor: '#4f46e5', color: 'white', padding: '1rem 2rem', borderRadius: '10px', textAlign: 'center' },
  totalLabel: { margin: 0, fontSize: '0.9rem', opacity: 0.8 },
  totalAmount: { margin: 0, fontSize: '1.8rem', fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' },
  card: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '1.5rem' },
  cardTitle: { color: '#4f46e5', marginBottom: '1rem' },
  empty: { color: '#9ca3af', textAlign: 'center', padding: '2rem' },
  expenseItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' },
  expenseTitle: { margin: 0, fontWeight: '600', color: '#1f2937' },
  expenseMeta: { margin: 0, fontSize: '0.85rem', color: '#6b7280' },
  expenseRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  expenseAmount: { margin: 0, fontWeight: 'bold', color: '#4f46e5', fontSize: '1.1rem' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }
};

export default Dashboard;