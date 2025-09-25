import React, { useContext, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const toggleDrawer = (val) => () => setOpen(val);
  const location = useLocation();

  const navItems = [
    { label: 'Leaders', to: '/leaders' },
    { label: 'Blog', to: '/blog' },
    { label: 'Events', to: '/events' },
    { label: 'Gallery', to: '/gallery' },
  ];
  if (user) {
    navItems.push({ label: 'Members', to: '/members' });
    navItems.push({ label: 'Profile', to: '/profile' });
  }
  if (user?.is_admin) {
    navItems.push({ label: 'Admin Dashboard', to: '/admin' });
  }

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <AppBar position="sticky" color="primary" sx={{ mb: 4 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2, py: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1} component={RouterLink} to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            <Avatar src="/images/ycs-placeholder.png" alt="YCS St. Dominic Logo" />
            <Typography variant="h6" component="div">
              YSC St. Dominic
            </Typography>
            {user?.is_admin && <Chip size="small" label="Admin" sx={{ bgcolor: 'info.main', color: 'text.primary' }} />}
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          {isSmall ? (
            <>
              <IconButton color="inherit" onClick={toggleDrawer(true)} aria-label="menu">
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 260 }} role="presentation" onClick={toggleDrawer(false)}>
                  <List>
                    {navItems.map((item) => (
                      <ListItem key={item.to} disablePadding>
                        <ListItemButton component={RouterLink} to={item.to} selected={isActive(item.to)}>
                          <ListItemText primary={item.label} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                  <Divider />
                  {/* Clerk auth controls (mobile) */}
                  <List>
                    <SignedIn>
                      <ListItem disablePadding>
                        <Box sx={{ px: 2, py: 1 }}>
                          <UserButton appearance={{ elements: { userButtonBox: { marginLeft: 0 } } }} />
                        </Box>
                      </ListItem>
                    </SignedIn>
                    <SignedOut>
                      <ListItem disablePadding>
                        <ListItemButton component={RouterLink} to="/sign-in">
                          <ListItemText primary="Clerk Sign In" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton component={RouterLink} to="/sign-up">
                          <ListItemText primary="Clerk Sign Up" />
                        </ListItemButton>
                      </ListItem>
                    </SignedOut>
                  </List>
                  <Divider />
                  <List>
                    {user ? (
                      <ListItem disablePadding>
                        <ListItemButton onClick={logout}><ListItemText primary="Logout" /></ListItemButton>
                      </ListItem>
                    ) : (
                      <>
                        <ListItem disablePadding>
                          <ListItemButton component={RouterLink} to="/login"><ListItemText primary="Login" /></ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                          <ListItemButton component={RouterLink} to="/register"><ListItemText primary="Register" /></ListItemButton>
                        </ListItem>
                      </>
                    )}
                  </List>
                  <Divider />
                  <List>
                    <ListItem disablePadding>
                      <ListItemButton component="a" href="/api/health" target="_blank" rel="noopener noreferrer">
                        <ListItemText primary="API Health" />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  component={RouterLink}
                  to={item.to}
                  underline="none"
                  sx={{
                    color: 'inherit',
                    fontWeight: isActive(item.to) ? 700 : 500,
                    bgcolor: isActive(item.to) ? 'action.selected' : 'transparent',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  {item.label}
                </Link>
              ))}
              {/* Clerk auth controls (desktop) */}
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <Stack direction="row" spacing={1} alignItems="center">
                  <SignInButton mode="modal">
                    <Button variant="outlined" color="inherit">Clerk Sign In</Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button variant="contained" color="secondary">Clerk Sign Up</Button>
                  </SignUpButton>
                </Stack>
              </SignedOut>
              <Link
                component="a"
                href="/api/health"
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{ color: 'inherit', opacity: 0.8 }}
              >
                API Health
              </Link>
              {user ? (
                <Button variant="outlined" color="inherit" onClick={logout}>Logout</Button>
              ) : (
                <Stack direction="row" spacing={1}>
                  <Link component={RouterLink} to="/login" underline="none" sx={{ color: 'inherit' }}>Login</Link>
                  <Link component={RouterLink} to="/register" underline="none" sx={{ color: 'inherit' }}>Register</Link>
                </Stack>
              )}
            </Stack>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
