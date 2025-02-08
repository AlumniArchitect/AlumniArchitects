import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Signin from './component/auth/Signin.jsx';
import Signup from './component/auth/Signup.jsx';
import HomePage from './component/HomePage.jsx';
import OtpVerification from './component/auth/OtpVerification.jsx';
import ForgotPassword from './component/auth/ForgotPassword.jsx';
import ProfilePage from './component/navbar/Profile.jsx';
import Setting from './component/navbar/Setting.jsx';
import BlogUI from './component/navbar/Blog.jsx';
import SplashScreen from './component/SplashScreen.jsx';

const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Navigate to='/splash-screen' />} />
      <Route path="*" element={<Navigate to='/splash-screen' />} />
      <Route path="/splash-screen" element={<SplashScreen />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<OtpVerification />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/setting" element={<Setting />} />
      <Route path="/blog" element={<BlogUI />} />
    </Routes>
     </>
  );
};

export default App;
