import React, { useContext, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { AuthContext } from '../../context/AuthContext.jsx';
import NavbarBrand from './NavbarBrand.jsx';
import NavbarLinks from './NavbarLinks.jsx';
import NavbarDrawer from './NavbarDrawer.jsx';
import { useNavItems } from './useNavItems.js';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const toggleDrawer = (val) => () => setOpen(val);

  const { items, isActive } = useNavItems(user);

  return (
    <AppBar position="sticky" color="primary" sx={{ mb: 4 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2, py: 1 }}>
          <NavbarBrand user={user} />
          <Box sx={{ flexGrow: 1 }} />
          {isSmall ? (
            <>
              <IconButton color="inherit" onClick={toggleDrawer(true)} aria-label="menu">
                <MenuIcon />
              </IconButton>
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
        </Toolbar>
      </Container>
    </AppBar>
  );
}
