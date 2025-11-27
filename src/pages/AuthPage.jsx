import React, { useState } from 'react';
import Login from '../components/Login';
import Signup from '../components/Signup';
import './AuthPage.css';

function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>🎬 Cinema Management System</h1>
          <p className="subtitle">Your Gateway to Movie Magic</p>
        </div>
        <div className="toggle-buttons">
          <button 
            className={showLogin ? 'active' : ''} 
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
          <button 
            className={!showLogin ? 'active' : ''} 
            onClick={() => setShowLogin(false)}
          >
            Sign Up
          </button>
        </div>
        {showLogin ? <Login /> : <Signup />}
      </div>
    </div>
  );
}

export default AuthPage;
