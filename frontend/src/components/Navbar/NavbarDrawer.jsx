import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Theme constants for consistency
const THEME = {
  background: '#1c1714',
  buttonBackground: 'rgba(255,255,255,0.05)',
  borderColor: 'rgba(201, 169, 98, 0.5)',
  activeBorder: 'rgba(201, 169, 98, 0.8)',
  dividerColor: 'rgba(255,255,255,0.12)',
};

// Style constants
const STYLES = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  drawer: {
    width: 260,
    minHeight: '100vh',
    maxHeight: '100vh',
    padding: '1rem 0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    backgroundColor: THEME.background,
    boxShadow: `0 0 0 1px ${THEME.borderColor}`,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  nav: {
    flex: '1 1 auto',
  },
  navList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  navLink: (isActive) => ({
    display: 'block',
    padding: '0.55rem 0.5rem',
    marginBottom: '0.1rem',
    borderRadius: '0.4rem',
    textDecoration: 'none',
    color: 'inherit',
    background: THEME.buttonBackground,
    borderLeft: isActive ? `3px solid ${THEME.activeBorder}` : '3px solid transparent',
    fontWeight: isActive ? 700 : 500,
  }),
  section: {
    borderTop: `1px solid ${THEME.dividerColor}`,
    paddingTop: '0.5rem',
    flex: '0 0 auto',
  },
  button: {
    width: '100%',
    borderRadius: '0.4rem',
    border: 'none',
    padding: '0.55rem 0.5rem',
    background: THEME.buttonBackground,
    color: 'inherit',
    cursor: 'pointer',
    fontWeight: 500,
  },
  authLinksContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.1rem',
  },
  authLink: {
    display: 'block',
    padding: '0.55rem 0.5rem',
    borderRadius: '0.4rem',
    textDecoration: 'none',
    color: 'inherit',
    background: THEME.buttonBackground,
    fontWeight: 500,
  },
  welcomeText: {
    paddingTop: '0.25rem',
    fontSize: '0.85rem',
    opacity: 0.85,
  },
  healthLink: {
    textDecoration: 'none',
    color: 'inherit',
    fontSize: '0.9rem',
  },
};

export default function NavbarDrawer({ open, onClose, items, isActive, user, onLogout }) {
  if (!open) return null;

  return (
    <div onClick={onClose} style={STYLES.overlay}>
      <div style={STYLES.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Navigation Links */}
        <nav style={STYLES.nav}>
          <ul style={STYLES.navList}>
            {items.map((item) => (
              <li key={item.to}>
                <RouterLink
                  to={item.to}
                  onClick={onClose}
                  className="navbar-drawer-link"
                  style={STYLES.navLink(isActive(item.to))}
                >
                  {item.label}
                </RouterLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Auth Section */}
        <div style={STYLES.section}>
          {user ? (
            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              style={STYLES.button}
            >
              Logout
            </button>
          ) : (
            <div style={STYLES.authLinksContainer}>
              <RouterLink to="/login" onClick={onClose} style={STYLES.authLink}>
                Login
              </RouterLink>
              <RouterLink to="/register" onClick={onClose} style={STYLES.authLink}>
                Register
              </RouterLink>
            </div>
          )}
        </div>

        {/* Welcome Message */}
        {user && (
          <div style={STYLES.welcomeText}>
            Welcome, <strong>{user.name}</strong>!
          </div>
        )}

        {/* API Health Link */}
        <div style={STYLES.section}>
          <a
            href="/api/health"
            target="_blank"
            rel="noopener noreferrer"
            style={STYLES.healthLink}
          >
            API Health
          </a>
        </div>
      </div>
    </div>
  );
}
