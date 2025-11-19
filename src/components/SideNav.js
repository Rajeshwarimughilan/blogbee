import React from 'react';
import { NavLink } from 'react-router-dom';
import './SideNav.css';

const SideNav = () => {
  return (
    <nav className="side-nav">
      <div className="nav-brand">🐝 BlogBee</div>
      <ul className="nav-list">
        <li><NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink></li>
        <li><NavLink to="/search" className={({isActive}) => isActive ? 'active' : ''}>Search</NavLink></li>
        <li><NavLink to="/create" className={({isActive}) => isActive ? 'active' : ''}>Create Post</NavLink></li>
        <li><NavLink to="/profile" className={({isActive}) => isActive ? 'active' : ''}>Profile</NavLink></li>
      </ul>
      <div className="nav-footer">
        <small>v1.0</small>
      </div>
    </nav>
  );
};

export default SideNav;