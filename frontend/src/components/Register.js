import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error registering');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type='text' placeholder='Name'
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input style={styles.input} type='email' placeholder='Email'
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input style={styles.input} type='password' placeholder='Password'
            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
          <button style={styles.btn} type='submit'>Register</button>
        </form>
        <p style={styles.text}>Already have an account? <Link to='/login'>Login</Link></p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f3f4f6' },
  card: { backgroundColor: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  title: { textAlign: 'center', color: '#4f46e5', marginBottom: '1.5rem' },
  input: { width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '5px', fontSize: '1rem', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '0.75rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' },
  text: { textAlign: 'center', marginTop: '1rem', color: '#6b7280' }
};

export default Register;