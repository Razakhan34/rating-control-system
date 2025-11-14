import React from 'react';
import { Container, Paper, Typography, TextField, Button } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import API from '../api';

const schema = Yup.object({
  oldPassword: Yup.string().required('Required'),
  newPassword: Yup.string().min(8,'Min 8').max(16,'Max 16')
    .matches(/(?=.*[A-Z])/,'Need uppercase')
    .matches(/(?=.*[^A-Za-z0-9])/,'Need special char')
    .required('Required'),
});

export default function ChangePassword(){
  return (
    <Container maxWidth="sm" sx={{ mt:4 }}>
      <Paper sx={{ p:3 }}>
        <Typography variant="h6" mb={2}>Change Password</Typography>
        <Formik initialValues={{ oldPassword:'', newPassword:'' }} validationSchema={schema}
          onSubmit={async (values, { setSubmitting, setStatus, resetForm })=>{
            try{
              await API.post('/auth/update-password', values);
              setStatus('Password updated');
              resetForm();
            }catch(e){
              setStatus(e.response?.data?.error || 'Failed to update');
            } finally { setSubmitting(false); }
          }}>
          {({ values, handleChange, handleBlur, handleSubmit, touched, errors, isSubmitting, status })=>(
            <form onSubmit={handleSubmit}>
              {status && <Typography color="error">{status}</Typography>}
              <TextField fullWidth label="Old Password" name="oldPassword" type="password" margin="normal"
                value={values.oldPassword} onChange={handleChange} onBlur={handleBlur}
                helperText={touched.oldPassword && errors.oldPassword} error={touched.oldPassword && Boolean(errors.oldPassword)} />
              <TextField fullWidth label="New Password" name="newPassword" type="password" margin="normal"
                value={values.newPassword} onChange={handleChange} onBlur={handleBlur}
                helperText={touched.newPassword && errors.newPassword} error={touched.newPassword && Boolean(errors.newPassword)} />
              <Button variant="contained" type="submit" disabled={isSubmitting} sx={{ mt:2 }}>Update</Button>
            </form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
}
