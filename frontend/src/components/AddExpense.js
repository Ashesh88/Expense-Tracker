import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AddExpense = ({ onExpenseAdded }) => {
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'Other', description: '' });
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/expenses', formData, {
        headers: { 'x-auth-token': token }
      });
      onExpenseAdded(res.data);
      setFormData({ title: '', amount: '', category: 'Other', description: '' });
    } catch (err) {
      alert('Error adding expense');
    }
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Add New Expense</h3>
      <form onSubmit={handleSubmit}>
        <input style={styles.input} type='text' placeholder='Title'
          value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
        <input style={styles.input} type='number' placeholder='Amount (₹)'
          value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
        <select style={styles.input} value={formData.category}
          onChange={e => setFormData({...formData, category: e.target.value})}>
          {['Food','Transport','Shopping','Bills','Entertainment','Other'].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input style={styles.input} type='text' placeholder='Description (optional)'
          value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        <button style={styles.btn} type='submit'>+ Add Expense</button>
      </form>
    </div>
  );
};

const styles = {
  card: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  title: { color: '#4f46e5', marginBottom: '1rem' },
  input: { width: '100%', padding: '0.75rem', marginBottom: '0.75rem', border: '1px solid #d1d5db', borderRadius: '5px', fontSize: '1rem', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '0.75rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' }
};

export default AddExpense;