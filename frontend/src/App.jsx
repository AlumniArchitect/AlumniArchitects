import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Signin from './component/auth/Signin.jsx';
import Signup from './component/auth/Signup.jsx';
import HomePage from './component/HomePage.jsx';
import OtpVerification from './component/auth/OtpVerification.jsx';
import ForgotPassword from './component/auth/ForgotPassword.jsx';
import ProfilePage from './component/Profile.jsx';
import Setting from './utils/Setting.jsx';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to='/login' />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<OtpVerification />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="*" element={<Navigate to='/signin' />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/setting" element={<Setting />} />
      
    </Routes>
  );
};

export default App;
