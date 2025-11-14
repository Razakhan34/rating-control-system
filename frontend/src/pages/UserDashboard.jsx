import React, { useEffect, useState } from 'react';
import API from '../api';
import { logout, getUser } from '../utils/auth';
import { Container, Box, Typography, TextField, Grid, Paper, Button } from '@mui/material';

export default function UserDashboard(){
  const [stores,setStores]=useState([]);
  const [q,setQ]=useState('');
  const user = getUser();

  async function load(){
    const res = await API.get('/user/stores', { params: { q } });
    setStores(res.data);
  }

  useEffect(()=>{ load(); },[q]);

  const submitRating = async (storeId, value) => {
    if(value < 1 || value > 5) return alert('Rating must be 1-5');
    await API.post('/user/ratings', { storeId, value });
    load();
  };

  return (
    <Container maxWidth="lg" sx={{ mt:4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Stores</Typography>
        <Box>
          <Typography variant="body2">Welcome, {user?.name}</Typography>
          <Button onClick={logout}>Logout</Button>
        </Box>
      </Box>

      <TextField placeholder="Search by name or address" fullWidth value={q} onChange={e=>setQ(e.target.value)} />

      <Grid container spacing={2} sx={{ mt:2 }}>
        {stores.map(s=>(
          <Grid item xs={12} sm={6} md={4} key={s.id}>
            <Paper sx={{ p:2 }}>
              <Typography variant="h6">{s.name}</Typography>
              <Typography variant="body2">{s.address}</Typography>
              <Typography variant="body2">Overall Rating: {s.rating || '—'}</Typography>
              <Typography variant="body2">Your Rating: {s.userRating || '—'}</Typography>
              <Box mt={1}>
                {[1,2,3,4,5].map(i=>(
                  <Button key={i} sx={{ m:0.5 }} variant="outlined" onClick={()=>submitRating(s.id,i)}>{i}</Button>
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
