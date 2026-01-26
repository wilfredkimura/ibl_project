import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default function NavbarBrand({ user }) {
  return (
    <RouterLink
      to="/"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      <span
        style={{
          fontWeight: 600,
          fontFamily: 'Cinzel, serif',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontSize: '0.85rem',
        }}
      >
        YSC St. Dominic
      </span>
      {user?.is_admin && (
        <span className="admin-badge">Admin</span>
      )}
    </RouterLink>
  );
}
