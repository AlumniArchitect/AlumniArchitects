import React from 'react';
import {Router, Route, Routes,Navigate} from 'react-router-dom';
import Login from './component/Login.jsx';
import Signup from './component/Signup.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to='/login' />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;
