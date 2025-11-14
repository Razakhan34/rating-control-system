import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminManage from './pages/AdminManage';
import ChangePassword from './pages/ChangePassword';
import NavBar from './components/NavBar';
import { getToken, getUser } from './utils/auth';

function PrivateRoute({ children, roles }){
  const token = getToken();
  const user = getUser();
  if(!token) return <Navigate to='/login' />;
  if(roles && !roles.includes(user?.role)) return <Navigate to='/' />;
  return children;
}

export default function App(){
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/stores" />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard/></PrivateRoute>} />
        <Route path="/admin/manage" element={<PrivateRoute roles={['admin']}><AdminManage/></PrivateRoute>} />
        <Route path="/stores" element={<PrivateRoute roles={['user','admin','owner']}><UserDashboard/></PrivateRoute>} />
        <Route path="/owner" element={<PrivateRoute roles={['owner']}><OwnerDashboard/></PrivateRoute>} />
        <Route path="/change-password" element={<PrivateRoute roles={['user','admin','owner']}><ChangePassword/></PrivateRoute>} />
      </Routes>
    </>
  );
}
