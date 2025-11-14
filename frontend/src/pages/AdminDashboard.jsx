import React, { useEffect, useState } from 'react';
import API from '../api';
import { logout } from '../utils/auth';
import { Container, Box, Typography, Grid, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function AdminDashboard(){
  const [stats,setStats]=useState({});

  useEffect(()=>{
    API.get('/admin/dashboard').then(r=>setStats(r.data)).catch(()=>{});
  },[]);

  return (
    <Container sx={{ mt:4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button component={Link} to="/admin/manage">Manage Users & Stores</Button>
      </Box>

      <Grid container spacing={2} sx={{ mt:2 }}>
        <Grid item><Paper sx={{ p:2 }}>Users: {stats.totalUsers}</Paper></Grid>
        <Grid item><Paper sx={{ p:2 }}>Stores: {stats.totalStores}</Paper></Grid>
        <Grid item><Paper sx={{ p:2 }}>Ratings: {stats.totalRatings}</Paper></Grid>
      </Grid>
    </Container>
  );
}
