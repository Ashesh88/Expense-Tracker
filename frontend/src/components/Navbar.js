import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to='/' style={styles.brand}>💰 Expense Tracker</Link>
      <div>
        {isAuthenticated ? (
          <button onClick={handleLogout} style={styles.btn}>Logout</button>
        ) : (
          <>
            <Link to='/login' style={styles.link}>Login</Link>
            <Link to='/register' style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem 2rem', backgroundColor: '#4f46e5', color: 'white'
  },
  brand: { color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' },
  link: { color: 'white', textDecoration: 'none', marginLeft: '1rem', fontSize: '1rem' },
  btn: { backgroundColor: 'white', color: '#4f46e5', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Navbar;