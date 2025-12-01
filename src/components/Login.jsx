import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login({ isAdmin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, adminLogin } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const userData = isAdmin ? await adminLogin(formData) : await login(formData);
      setMessage(`Welcome back, ${userData.username}!${userData.role === 'ADMIN' ? ' (Admin Access)' : ` You have ${userData.loyaltyPoints} loyalty points.`}`);
      // Redirect based on role
      setTimeout(() => {
        if (userData.role === 'ADMIN') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/home';
        }
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>{isAdmin ? 'Admin Login' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {message && <p className={message.includes('Welcome') ? 'message success' : 'message error'}>{message}</p>}
    </div>
  );
}

export default Login;
