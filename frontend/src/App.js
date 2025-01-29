import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './component/auth/Login.jsx';
import Signup from './component/auth/Signup.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to='/login' />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to='/login' />} />
    </Routes>
  );
};

export default App;
