import React, { useEffect, useState } from 'react';
import API from '../api';
import { logout, getUser } from '../utils/auth';
import { Container, Typography, Paper, Grid, Button } from '@mui/material';

export default function OwnerDashboard(){
  const [stores,setStores]=useState([]);
  const user = getUser();

  useEffect(()=>{
    API.get('/store/owner/dashboard').then(r=>setStores(r.data)).catch(()=>{});
  },[]);

  return (
    <Container sx={{ mt:4 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <Typography variant="h4">Owner Dashboard</Typography>
        <div>
          <Typography variant="body2">Welcome {user?.name}</Typography>
          <Button onClick={logout}>Logout</Button>
        </div>
      </div>
      <Grid container spacing={2} sx={{ mt:2 }}>
        {stores.map(s=>(
          <Grid item xs={12} md={6} key={s.id}>
            <Paper sx={{ p:2 }}>
              <Typography variant="h6">{s.name}</Typography>
              <Typography>Avg Rating: {s.avgRating || '—'}</Typography>
              <Typography variant="subtitle1">Ratings</Typography>
              {s.ratings.map((r,idx)=>(
                <Typography key={idx}>{r.name} — {r.email} — {r.value}</Typography>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
