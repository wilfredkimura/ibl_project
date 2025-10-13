import React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

export default function NavbarDrawer({ open, onClose, items, isActive, user, onLogout }) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 260 }} role="presentation" onClick={onClose}>
        <List>
          {items.map((item) => (
            <ListItem key={item.to} disablePadding>
              <ListItemButton component={RouterLink} to={item.to} selected={isActive(item.to)}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {user ? (
            <ListItem disablePadding>
              <ListItemButton onClick={onLogout}><ListItemText primary="Logout" /></ListItemButton>
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
        {user && (
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Welcome, <strong>{user.name}</strong>!
            </Typography>
          </Box>
        )}
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
  );
}
