import React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Constant from "../../utils/Constant"

const Signup = () => {
  const [signupInfo, setSignupInfo] = useState({
    fullName: "",
    email: "",
    password: "",
    isAlumni: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo({
      ...signupInfo,
      [name]: value
    });
  }

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    localStorage.setItem("email", signupInfo.email);

    try {
      const URL = `${Constant.BASE_URL}/auth/signup`;

      const res = await fetch(URL, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupInfo)
      });

      const result = await res.json();

      if (result.status) {

        setTimeout(() => {
          navigate('/verify-otp');
        }, 500);

      } else {
        alert("Error occurred");
      }

    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <div className="form-group">
        <input
          type="text"
          name='fullName'
          placeholder="Full Name"
          value={signupInfo.fullName}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <input
          type="email"
          name='email'
          placeholder="Email"
          value={signupInfo.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          name='password'
          placeholder="Password"
          value={signupInfo.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <select
          value={signupInfo.isAlumni}
          name='isAlumni'
          onChange={handleChange}
        >
          <option value="student">Student</option>
          <option value="alumni">Alumni</option>
        </select>
      </div>
      <div className="form-group">
        <button onClick={handleSignup}>Sign Up</button>
      </div>
      <div className="form-links">
        <Link to="/signin">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default Signup;
