import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import pngLogo from '../honey.png';
import './SideNav.css';

const SideNav = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="side-nav">
      <div className="nav-brand">
  <img src={pngLogo} alt="BlogBee" className="nav-logo" />
        <span className="brand-text">BlogBee</span>
      </div>
      <ul className="nav-list">
        <li><NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink></li>
        <li><NavLink to="/search" className={({isActive}) => isActive ? 'active' : ''}>Search</NavLink></li>
        <li><NavLink to="/create" className={({isActive}) => isActive ? 'active' : ''}>Create Post</NavLink></li>
        <li><NavLink to="/profile" className={({isActive}) => isActive ? 'active' : ''}>Profile</NavLink></li>
      </ul>

      <div className="auth-actions">
        {user ? (
          <>
            <div className="signed-in">Signed in as <strong>{user.username || user.name || user.email}</strong></div>
            <button className="auth-btn logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="auth-btn" onClick={() => navigate('/login')}>Login</button>
            <button className="auth-btn" onClick={() => navigate('/signup')}>Sign up</button>
          </>
        )}
      </div>

      <div className="nav-footer">
        <small>v1.0</small>
      </div>
    </nav>
  );
};

export default SideNav;