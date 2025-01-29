import React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpVisible, setOtpVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    // Assume email and password validation
    if (email === 'user@example.com' && password === 'password123') {
      setOtpVisible(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleOtpSubmit = () => {
    if (otp === '123456') {
      alert('Login successful!');
      navigate('/homepage'); // Navigate to a dashboard or home page after successful login
    } else {
      alert('Invalid OTP');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <div className="form-group">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {isOtpVisible && (
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
      )}
      <div className="form-group">
        <button onClick={isOtpVisible ? handleOtpSubmit : handleLogin}>
          {isOtpVisible ? 'Submit OTP' : 'Login'}
        </button>
      </div>
      <div className="form-links">
        <Link to="/forgot-password">Forgot Password?</Link>
        <br />
        <Link to="/signup">Don't have an account? Sign up</Link>
      </div>
    </div>
  );
};