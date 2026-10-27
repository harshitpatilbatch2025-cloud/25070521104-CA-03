import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import { Icon } from './Icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { initials } from '../utils/format.js';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/scam-types', label: 'Scam Types' },
  { to: '/learn', label: 'Learn' },
  { to: '/quizzes', label: 'Quizzes' },
];

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('nav-open', menuOpen);
    return () => document.body.classList.remove('nav-open');
  }, [menuOpen]);

  async function handleLogout() {
    try {
      await logout();
      setMenuOpen(false);
      toast.success('You have been logged out securely.');
      navigate('/');
    } catch {
      toast.error('Could not log out. Please try again.');
    }
  }

  const navLinks = (
    <>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`.trim()}
        >
          {link.label}
        </NavLink>
      ))}
      {user && (
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`.trim()}
        >
          Dashboard
        </NavLink>
      )}
    </>
  );

  return (
    <header className="nav-wrap">
      <nav className="nav container" aria-label="Main navigation">
        <Logo />

        <div className="nav-links">{navLinks}</div>

        <div className="nav-actions">
          {loading ? (
            <span className="nav-loading" aria-label="Checking session" />
          ) : user ? (
            <>
              <Link to="/dashboard" className="user-chip" title="Open your dashboard">
                <span className="avatar">{initials(user.name)}</span>
                <span className="user-chip-name">{user.name.split(' ')[0]}</span>
              </Link>
              <button type="button" className="btn btn-ghost btn-sm logout-btn" onClick={handleLogout}>
                <Icon name="logout" size={16} />
                <span>Log out</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
                <Icon name="arrowRight" size={16} />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="mobile-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
        </button>
      </nav>

      <div id="mobile-menu" className={`mobile-panel ${menuOpen ? 'is-open' : ''}`}>
        <div className="container mobile-panel-inner">
          <div className="mobile-links">{navLinks}</div>
          <div className="mobile-actions">
            {user ? (
              <>
                <div className="mobile-user">
                  <span className="avatar">{initials(user.name)}</span>
                  <div>
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                </div>
                <Link to="/dashboard" className="btn btn-primary btn-block">
                  Open dashboard
                </Link>
                <button type="button" className="btn btn-outline btn-block" onClick={handleLogout}>
                  <Icon name="logout" size={16} /> Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-block">
                  Create free account <Icon name="arrowRight" size={16} />
                </Link>
                <Link to="/login" className="btn btn-outline btn-block">
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
