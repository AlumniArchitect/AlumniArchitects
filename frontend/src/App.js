import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Signin from './component/auth/Signin.jsx';
import Signup from './component/auth/Signup.jsx';
import HomePage from './component/HomePage.jsx';
import OtpVerification from './component/auth/OtpVerification.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to='/login' />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<OtpVerification />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="*" element={<Navigate to='/signin' />} />
    </Routes>
  );
};

export default App;
