import React, { useState, useEffect } from 'react';
import Constant from '../../utils/Constant';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleResetPassword = () => {
    const sendOtp = async () => {
      if (email) {
        try {
          const URL = `${Constant.BASE_URL}/auth/forgot-password?email=${email}`;

          const res = await fetch(URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
          });

          const result = await res.json();

          if (result.status) {
            navigate("/verify-otp", { state: { isForgotPassword: true } });
          } else {
            alert(result.message);
          }
        } catch (e) {
          alert("An error occurred. Check the console.");
          console.error(e);
        }
      } else {
        alert('Please enter your email');
      }
    };

    sendOtp();
  };

  return (
    <div id='forgot-password' className="form-container">
      <h2>Forgot Password</h2>
      <div className="form-group">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <button onClick={handleResetPassword}>Send OTP</button>
      </div>
    </div>
  );
};

export default ForgotPassword;