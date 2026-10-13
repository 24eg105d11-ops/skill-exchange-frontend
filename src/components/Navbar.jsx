import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, isAuthenticated, isAdmin, unreadNotifications, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to={isAuthenticated ? (isAdmin ? "/admin" : "/dashboard") : "/"} className="navbar-brand">
          <span className="brand-badge">B.Tech</span>
          <span>SkillExchange</span>
          {isAdmin && <span className="admin-tag">Admin</span>}
        </Link>

        <nav>
          <ul className="nav-links">
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <>
                    <li>
                      <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/my-skills" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        My Skills
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/discovery" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        Discovery
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/matches" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        Matches
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/requests/incoming" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        Requests
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/conversations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        Messages
                      </NavLink>
                    </li>
                  </>
                )}

                {isAdmin && (
                  <>
                    <li>
                      <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        Admin Panel
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        Users
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/skills" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        Skills Moderation
                      </NavLink>
                    </li>
                  </>
                )}

                <li>
                  <NavLink to="/ai-assistant" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    AI Guide
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/notifications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Alerts
                    {unreadNotifications > 0 && (
                      <span className="nav-badge">{unreadNotifications}</span>
                    )}
                  </NavLink>
                </li>

                <li className="nav-user">
                  <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    {user?.fullName?.split(' ')[0] || 'Profile'}
                  </NavLink>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log out">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/discovery" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Browse Skills
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/ai-assistant" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Platform FAQ
                  </NavLink>
                </li>
                <li>
                  <Link to="/login" className="btn btn-secondary btn-sm">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
