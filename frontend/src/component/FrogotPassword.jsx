import React from 'react';
import { useNavigate,Link,useState} from 'react-router-dom';
import '..style/styles.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    if (email) {
      alert('Password reset link sent!');
    } else {
      alert('Please enter your email');
    }
  };

  return (
    <div className="form-container">
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
        <button onClick={handleResetPassword}>Reset Password</button>
      </div>
    </div>
  );
};

export default ForgotPassword;
