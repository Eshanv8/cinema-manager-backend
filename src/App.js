import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="App">
      <div className="container">
        <h1>Cinema Management System</h1>
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
            Signup
          </button>
        </div>
        {showLogin ? <Login /> : <Signup />}
      </div>
    </div>
  );
}

export default App;
