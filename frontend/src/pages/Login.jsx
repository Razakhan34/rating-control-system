import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { saveAuth } from '../utils/auth';
import { Container, Paper, Typography, TextField, Button, Box } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';

const schema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

export default function Login(){
  const nav = useNavigate();
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{p:4, mt:8}}>
        <Typography variant="h5" mb={2}>Login</Typography>
        <Formik initialValues={{ email:'', password:'' }} validationSchema={schema}
          onSubmit={async (values, { setStatus, setSubmitting })=>{
            try{
              const res = await API.post('/auth/login', values);
              saveAuth(res.data);
              if(res.data.user.role === 'admin') nav('/admin');
              else if(res.data.user.role === 'owner') nav('/owner');
              else nav('/stores');
            }catch(err){
              setStatus(err.response?.data?.error || 'Login failed');
            } finally { setSubmitting(false); }
          }}>
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, status })=>(
            <form onSubmit={handleSubmit}>
              {status && <Typography color="error" mb={1}>{status}</Typography>}
              <TextField fullWidth label="Email" name="email" margin="normal" value={values.email}
                onChange={handleChange} onBlur={handleBlur} helperText={touched.email && errors.email} error={touched.email && Boolean(errors.email)} />
              <TextField fullWidth label="Password" name="password" margin="normal" type="password" value={values.password}
                onChange={handleChange} onBlur={handleBlur} helperText={touched.password && errors.password} error={touched.password && Boolean(errors.password)} />
              <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                <Button variant="contained" type="submit" disabled={isSubmitting}>Login</Button>
                <Button component={Link} to="/signup">Sign up</Button>
              </Box>
            </form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
}
