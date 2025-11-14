import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Grid, Paper, TextField, Button, MenuItem, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import API from '../api';

export default function AdminManage(){
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [q, setQ] = useState('');
  const [userForm, setUserForm] = useState({ name:'', email:'', address:'', password:'', role:'user' });
  const [storeForm, setStoreForm] = useState({ name:'', email:'', address:'', owner_id: '' });
  const [sort, setSort] = useState({ field:'name', dir:'asc' });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(()=>{ load(); },[q, sort, tab, page]);

  async function load(){
    if(tab === 'users'){
      const res = await API.get('/admin/users', { params: { q, sortBy: sort.field, order: sort.dir.toUpperCase(), page, limit:10 } });
      setUsers(res.data.data);
      setTotal(res.data.total);
    } else {
      const res = await API.get('/admin/stores', { params: { q, sortBy: sort.field, order: sort.dir.toUpperCase(), page, limit:10 } });
      setStores(res.data.data);
      setTotal(res.data.total);
    }
  }

  const createUser = async () => {
    try{
      await API.post('/admin/users', userForm);
      setUserForm({ name:'', email:'', address:'', password:'', role:'user' });
      load();
      alert('User created');
    }catch(e){ alert(e.response?.data?.error || 'Failed'); }
  };

  const createStore = async () => {
    try{
      await API.post('/admin/stores', storeForm);
      setStoreForm({ name:'', email:'', address:'', owner_id: '' });
      load();
      alert('Store created');
    }catch(e){ alert(e.response?.data?.error || 'Failed'); }
  };

  const startEditUser = (u) => { setEditing({ type:'user', data: u }); setOpen(true); };
  const startEditStore = (s) => { setEditing({ type:'store', data: s }); setOpen(true); };

  const deleteUser = async (id) => {
    if(!window.confirm('Delete user?')) return;
    await API.delete('/admin/users/'+id);
    load();
  };
  const deleteStore = async (id) => {
    if(!window.confirm('Delete store?')) return;
    await API.delete('/admin/stores/'+id);
    load();
  };

  const saveEdit = async (payload) => {
    try{
      if(editing.type === 'user'){
        await API.put('/admin/users/'+editing.data.id, payload);
      } else {
        await API.put('/admin/stores/'+editing.data.id, payload);
      }
      setOpen(false);
      setEditing(null);
      load();
    }catch(e){ alert(e.response?.data?.error || 'Failed'); }
  };

  const changeSort = (field) => {
    setSort(s => ({ field, dir: s.dir === 'asc' ? 'desc' : 'asc' }));
  };

  return (
    <Container>
      <Typography variant="h4" mb={2}>Admin Console</Typography>
      <Box sx={{ display:'flex', gap:2, mb:2 }}>
        <Button variant={tab==='users'?'contained':'outlined'} onClick={()=>{ setTab('users'); setPage(1); }}>Users</Button>
        <Button variant={tab==='stores'?'contained':'outlined'} onClick={()=>{ setTab('stores'); setPage(1); }}>Stores</Button>
        <Button sx={{ ml:2 }} variant="outlined" href="/admin/manage">Refresh</Button>
      </Box>

      <Paper sx={{ p:2, mb:2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><TextField label="Filter (name/email/address)" fullWidth value={q} onChange={e=>setQ(e.target.value)} /></Grid>
          <Grid item xs={12} sm={6}><TextField select label="Sort by" value={sort.field} onChange={e=>setSort(s=>({ ...s, field:e.target.value }))} fullWidth>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="address">Address</MenuItem>
          </TextField></Grid>
        </Grid>
      </Paper>

      {tab === 'users' && (
        <>
          <Paper sx={{ p:2, mb:2 }}>
            <Typography variant="h6">Create User</Typography>
            <Grid container spacing={2} sx={{ mt:1 }}>
              <Grid item xs={12} sm={6}><TextField label="Name" fullWidth value={userForm.name} onChange={e=>setUserForm({...userForm, name:e.target.value})} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Email" fullWidth value={userForm.email} onChange={e=>setUserForm({...userForm, email:e.target.value})} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Address" fullWidth value={userForm.address} onChange={e=>setUserForm({...userForm, address:e.target.value})} /></Grid>
              <Grid item xs={12} sm={3}><TextField label="Password" type="password" fullWidth value={userForm.password} onChange={e=>setUserForm({...userForm, password:e.target.value})} /></Grid>
              <Grid item xs={12} sm={3}><TextField select label="Role" value={userForm.role} onChange={e=>setUserForm({...userForm, role:e.target.value})} fullWidth><MenuItem value="user">User</MenuItem><MenuItem value="admin">Admin</MenuItem><MenuItem value="owner">Owner</MenuItem></TextField></Grid>
              <Grid item xs={12}><Button variant="contained" onClick={createUser}>Create User</Button></Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p:2 }}>
            <Typography variant="h6">Users</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell onClick={()=>changeSort('name')}>Name</TableCell>
                  <TableCell onClick={()=>changeSort('email')}>Email</TableCell>
                  <TableCell onClick={()=>changeSort('address')}>Address</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(u=>(
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.address}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>
                      <IconButton onClick={()=>startEditUser(u)}><EditIcon/></IconButton>
                      <IconButton onClick={()=>deleteUser(u.id)}><DeleteIcon/></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ mt:2, display:'flex', gap:2, alignItems:'center' }}>
              <Button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</Button>
              <Typography>Page {page}</Typography>
              <Button disabled={(page*10)>=total} onClick={()=>setPage(p=>p+1)}>Next</Button>
            </Box>
          </Paper>
        </>
      )}

      {tab === 'stores' && (
        <>
          <Paper sx={{ p:2, mb:2 }}>
            <Typography variant="h6">Create Store</Typography>
            <Grid container spacing={2} sx={{ mt:1 }}>
              <Grid item xs={12} sm={6}><TextField label="Name" fullWidth value={storeForm.name} onChange={e=>setStoreForm({...storeForm, name:e.target.value})} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Email" fullWidth value={storeForm.email} onChange={e=>setStoreForm({...storeForm, email:e.target.value})} /></Grid>
              <Grid item xs={12} sm={8}><TextField label="Address" fullWidth value={storeForm.address} onChange={e=>setStoreForm({...storeForm, address:e.target.value})} /></Grid>
              <Grid item xs={12} sm={4}><TextField label="Owner ID (optional)" fullWidth value={storeForm.owner_id} onChange={e=>setStoreForm({...storeForm, owner_id:e.target.value})} /></Grid>
              <Grid item xs={12}><Button variant="contained" onClick={createStore}>Create Store</Button></Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p:2 }}>
            <Typography variant="h6">Stores</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell onClick={()=>changeSort('name')}>Name</TableCell>
                  <TableCell onClick={()=>changeSort('email')}>Email</TableCell>
                  <TableCell onClick={()=>changeSort('address')}>Address</TableCell>
                  <TableCell>Avg Rating</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stores.map(s=>(
                  <TableRow key={s.id}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.address}</TableCell>
                    <TableCell>{s.rating || '—'}</TableCell>
                    <TableCell>
                      <IconButton onClick={()=>startEditStore(s)}><EditIcon/></IconButton>
                      <IconButton onClick={()=>deleteStore(s.id)}><DeleteIcon/></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ mt:2, display:'flex', gap:2, alignItems:'center' }}>
              <Button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</Button>
              <Typography>Page {page}</Typography>
              <Button disabled={(page*10)>=total} onClick={()=>setPage(p=>p+1)}>Next</Button>
            </Box>
          </Paper>
        </>
      )}

      <Dialog open={open} onClose={()=>setOpen(false)} fullWidth>
        <DialogTitle>Edit {editing?.type}</DialogTitle>
        <DialogContent>
          {editing?.type === 'user' && (
            <Box sx={{ display:'grid', gap:2 }}>
              <TextField label="Name" defaultValue={editing.data.name} onChange={e=>editing.data.name = e.target.value} />
              <TextField label="Email" defaultValue={editing.data.email} onChange={e=>editing.data.email = e.target.value} />
              <TextField label="Address" defaultValue={editing.data.address} onChange={e=>editing.data.address = e.target.value} />
              <TextField select label="Role" defaultValue={editing.data.role} onChange={e=>editing.data.role = e.target.value}>
                <MenuItem value="user">User</MenuItem><MenuItem value="admin">Admin</MenuItem><MenuItem value="owner">Owner</MenuItem>
              </TextField>
            </Box>
          )}
          {editing?.type === 'store' && (
            <Box sx={{ display:'grid', gap:2 }}>
              <TextField label="Name" defaultValue={editing.data.name} onChange={e=>editing.data.name = e.target.value} />
              <TextField label="Email" defaultValue={editing.data.email} onChange={e=>editing.data.email = e.target.value} />
              <TextField label="Address" defaultValue={editing.data.address} onChange={e=>editing.data.address = e.target.value} />
              <TextField label="Owner ID" defaultValue={editing.data.owner_id} onChange={e=>editing.data.owner_id = e.target.value} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Cancel</Button>
          <Button onClick={()=>{
            if(editing?.type === 'user') saveEdit({ name: editing.data.name, email: editing.data.email, address: editing.data.address, role: editing.data.role });
            if(editing?.type === 'store') saveEdit({ name: editing.data.name, email: editing.data.email, address: editing.data.address, owner_id: editing.data.owner_id });
          }}>Save</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}
