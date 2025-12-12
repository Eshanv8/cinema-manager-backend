import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/home" className="nav-logo">
          <span className="logo-text">CINEMA PALACE</span>
        </Link>
        
        <button className="nav-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link 
              to="/home" 
              className={`nav-link ${isActive('/home') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/movies" 
              className={`nav-link ${isActive('/movies') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Movies
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/bookings" 
              className={`nav-link ${isActive('/bookings') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              My Bookings
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/profile" 
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {user?.username}
            </Link>
          </li>
          <li className="nav-item">
            <button onClick={handleLogout} className="nav-logout">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
