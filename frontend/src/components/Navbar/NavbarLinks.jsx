import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default function NavbarLinks({ items, isActive, user, onLogout }) {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      {items.map((item) => (
        <RouterLink
          key={item.to}
          to={item.to}
          className="navbar-link"
          style={{
            fontWeight: isActive(item.to) ? 700 : 500,
            background: isActive(item.to) ? 'rgba(255,255,255,0.12)' : 'transparent',
          }}
        >
          {item.label}
        </RouterLink>
      ))}
      {user && (
        <span style={{ opacity: 0.9, fontSize: '0.9rem' }}>
          Welcome, <strong>{user.name}</strong>!
        </span>
      )}
      <a
        href="/api/health"
        target="_blank"
        rel="noopener noreferrer"
        className="navbar-link"
      >
        API Health
      </a>
      {user ? (
        <button
          type="button"
          onClick={onLogout}
          style={{
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '0.35rem 0.9rem',
            background: 'transparent',
            color: 'inherit',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <RouterLink to="/login" className="navbar-link">
            Login
          </RouterLink>
          <RouterLink to="/register" className="navbar-link">
            Register
          </RouterLink>
        </div>
      )}
    </nav>
  );
}
