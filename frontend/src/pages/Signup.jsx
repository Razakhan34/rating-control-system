import React from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { saveAuth } from '../utils/auth';
import { Box, Button, Container, TextField, Typography, Paper } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().min(20,'Name must be at least 20 characters').max(60,'Name must be at most 60 characters').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  address: Yup.string().max(400,'Address too long'),
  password: Yup.string()
    .min(8,'Password must be 8-16 characters')
    .max(16,'Password must be 8-16 characters')
    .matches(/(?=.*[A-Z])/, 'Must contain at least one uppercase letter')
    .matches(/(?=.*[^A-Za-z0-9])/, 'Must contain at least one special character')
    .required('Required'),
});

export default function Signup(){
  const nav = useNavigate();

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p:4, mt:6 }}>
        <Typography variant="h5" mb={2}>Create account</Typography>
        <Formik initialValues={{ name:'', email:'', address:'', password:'' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setStatus })=>{
            try{
              const res = await API.post('/auth/signup', values);
              saveAuth(res.data);
              nav('/stores');
            }catch(err){
              setStatus(err.response?.data?.error || 'Signup failed');
            } finally { setSubmitting(false); }
          }}>
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, status })=>(
            <form onSubmit={handleSubmit}>
              {status && <Typography color="error" mb={1}>{status}</Typography>}
              <TextField fullWidth label="Full name" name="name" margin="normal"
                value={values.name} onChange={handleChange} onBlur={handleBlur}
                helperText={touched.name && errors.name} error={touched.name && Boolean(errors.name)} />
              <TextField fullWidth label="Email" name="email" margin="normal"
                value={values.email} onChange={handleChange} onBlur={handleBlur}
                helperText={touched.email && errors.email} error={touched.email && Boolean(errors.email)} />
              <TextField fullWidth label="Address" name="address" margin="normal"
                value={values.address} onChange={handleChange} onBlur={handleBlur}
                helperText={touched.address && errors.address} error={touched.address && Boolean(errors.address)} />
              <TextField fullWidth label="Password" name="password" type="password" margin="normal"
                value={values.password} onChange={handleChange} onBlur={handleBlur}
                helperText={touched.password && errors.password} error={touched.password && Boolean(errors.password)} />
              <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                <Button variant="contained" type="submit" disabled={isSubmitting}>Sign up</Button>
              </Box>
            </form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
}
