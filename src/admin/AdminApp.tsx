// src/admin/AdminApp.tsx
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import Login from './Login';
import Inbox from './sections/Inbox';
import Outreach from './sections/Outreach';
import PostUpdates from './sections/PostUpdates';
import ReviewsAdmin from './sections/ReviewsAdmin';
import ManageProjects from './sections/ManageProjects';
import ChatAdmin from './sections/ChatAdmin'; // ← Added

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const savedUser = localStorage.getItem('admin_user');
    if (token) {
      setIsAuthenticated(true);
      if (savedUser) setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
    navigate('/admin/login');
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    );
  }

  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'AD';

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="wrap">
          <div className="admin-brand">
            <div className="admin-brand-mark">IS</div>
            <div className="admin-brand-text">
              <b>Admin Panel</b>
              <small>ISDL Website</small>
            </div>
          </div>
          <div className="admin-user">
            <div className="admin-avatar">{initials}</div>
            <button
              onClick={handleLogout}
              className="btn-icon"
              style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,.2)' }}
            >
              <i className="bx bx-log-out" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        <nav className="admin-tabs">
          <NavLink to="/admin/inbox" className={({ isActive }) => `admin-tab ${isActive ? 'on' : ''}`}>
            <i className="bx bx-inbox" /> Inbox
          </NavLink>
          <NavLink to="/admin/outreach" className={({ isActive }) => `admin-tab ${isActive ? 'on' : ''}`}>
            <i className="bx bx-group" /> Outreach
          </NavLink>
          <NavLink to="/admin/projects" className={({ isActive }) => `admin-tab ${isActive ? 'on' : ''}`}>
            <i className="bx bx-briefcase" /> Projects
          </NavLink>
          <NavLink to="/admin/updates" className={({ isActive }) => `admin-tab ${isActive ? 'on' : ''}`}>
            <i className="bx bx-news" /> Site Updates
          </NavLink>
          <NavLink to="/admin/reviews" className={({ isActive }) => `admin-tab ${isActive ? 'on' : ''}`}>
            <i className="bx bx-star" /> Reviews
          </NavLink>
          <NavLink to="/admin/chat" className={({ isActive }) => `admin-tab ${isActive ? 'on' : ''}`}>
            <i className="bx bx-chat" /> Live Chat
          </NavLink>
        </nav>

        <Routes>
          <Route path="inbox" element={<Inbox />} />
          <Route path="outreach" element={<Outreach />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="updates" element={<PostUpdates />} />
          <Route path="reviews" element={<ReviewsAdmin />} />
          <Route path="chat" element={<ChatAdmin />} />
          <Route path="*" element={<Navigate to="/admin/inbox" replace />} />
        </Routes>
      </div>
    </div>
  );
}