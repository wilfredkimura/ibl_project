import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

export default function NavbarBrand({ user }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      component={RouterLink}
      to="/"
      style={{ color: 'inherit', textDecoration: 'none' }}
    >
      <Avatar src="/images/ycs-placeholder.png" alt="YCS St. Dominic Logo" />
      <Typography variant="h6" component="div">
        YSC St. Dominic
      </Typography>
      {user?.is_admin && (
        <Chip size="small" label="Admin" sx={{ bgcolor: 'info.main', color: 'text.primary' }} />
      )}
    </Stack>
  );
}
