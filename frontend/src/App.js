import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Signin from './component/auth/Signin.jsx';
import Signup from './component/auth/Signup.jsx';
<<<<<<< HEAD
import Homepage from './component/HomPage.jsx';
=======
import HomePage from './component/HomePage.jsx';
>>>>>>> bcee53f035da00c0f0c366faa2c91770bd61c814
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
