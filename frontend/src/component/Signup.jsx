import React from 'react';
import { useState } from 'react';
import { useNavigate,Link} from 'react-router-dom';


const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const navigate = useNavigate();

  const handleSignup = () => {
    // Assume form submission validation
    if (fullName && email && password) {
      alert('Account created successfully!');
      navigate('/login'); // Redirect to login page after successful signup
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
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
      <div className="form-group">
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="student">Student</option>
          <option value="alumni">Alumni</option>
        </select>
      </div>
      <div className="form-group">
        <button onClick={handleSignup}>Sign Up</button>
      </div>
      <div className="form-links">
        <Link to="/login">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default Signup;
