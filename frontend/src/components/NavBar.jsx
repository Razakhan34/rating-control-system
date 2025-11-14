import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';

export default function NavBar(){
  const user = getUser();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <AppBar position="static" sx={{ mb:3 }}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ color:'#fff', textDecoration:'none', flexGrow:1 }}>
          Rating Control System
        </Typography>
        {user && (
          <Box sx={{ display:'flex', gap:1, alignItems:'center' }}>
            {user.role === 'admin' && <Button component={Link} to="/admin" color="inherit">Admin</Button>}
            { (user.role === 'user' || user.role === 'admin' || user.role === 'owner') && <Button component={Link} to="/stores" color="inherit">Stores</Button>}
            {user.role === 'owner' && <Button component={Link} to="/owner" color="inherit">Owner</Button>}
            <Button component={Link} to="/change-password" color="inherit">Change Password</Button>
            <Button onClick={handleLogout} color="inherit">Logout</Button>
          </Box>
        )}
        {!user && (
          <Box>
            <Button component={Link} to="/login" color="inherit">Login</Button>
            <Button component={Link} to="/signup" color="inherit">Sign up</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
