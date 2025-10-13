import React from 'react';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';

export default function NavbarLinks({ items, isActive, user, onLogout }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {items.map((item) => (
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
      {user && (
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Welcome, <strong>{user.name}</strong>!
        </Typography>
      )}
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
        <Button variant="outlined" color="inherit" onClick={onLogout}>Logout</Button>
      ) : (
        <Stack direction="row" spacing={1}>
          <Link component={RouterLink} to="/login" underline="none" sx={{ color: 'inherit' }}>Login</Link>
          <Link component={RouterLink} to="/register" underline="none" sx={{ color: 'inherit' }}>Register</Link>
        </Stack>
      )}
    </Stack>
  );
}
