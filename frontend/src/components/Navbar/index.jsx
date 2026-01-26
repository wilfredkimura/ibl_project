import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import NavbarBrand from './NavbarBrand.jsx';
import NavbarLinks from './NavbarLinks.jsx';
import NavbarDrawer from './NavbarDrawer.jsx';
import { useNavItems } from './useNavItems.js';

function useIsSmall(breakpoint = 960) {
  const [isSmall, setIsSmall] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => setIsSmall(window.innerWidth < breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);

  return isSmall;
}

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const isSmall = useIsSmall();
  const [open, setOpen] = useState(false);
  const toggleDrawer = (val) => () => setOpen(val);

  const { items, isActive } = useNavItems(user);

  return (
    <header
      className="glass-surface"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        marginBottom: '1.5rem',
        backdropFilter: 'blur(18px)',
        backgroundColor: 'rgba(28, 23, 20, 0.96)',
        borderBottom: '1px solid rgba(201, 169, 98, 0.5)',
      }}
    >
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '0.8rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <NavbarBrand user={user} />
        <div style={{ flexGrow: 1 }} />
        {isSmall ? (
          <>
            <button
              type="button"
              onClick={toggleDrawer(true)}
              aria-label="Open menu"
              style={{
                border: 'none',
                background: 'transparent',
                color: 'inherit',
                cursor: 'pointer',
                fontSize: '1.4rem',
              }}
            >
              ☰
            </button>
            <NavbarDrawer
              open={open}
              onClose={toggleDrawer(false)}
              items={items}
              isActive={isActive}
              user={user}
              onLogout={logout}
            />
          </>
        ) : (
          <NavbarLinks items={items} isActive={isActive} user={user} onLogout={logout} />
        )}
      </div>
    </header>
  );
}
