import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Constant from "../../utils/Constant"

export default function Signin() {

  const URL = `${Constant.BASE_URL}/auth/signin`;

  useEffect(() => {
    const fetchData = async () => {
      const jwt = localStorage.getItem("jwt");

      if (jwt) {
        const res = await fetch(URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`,
          },
        });

        const result = await res.json();

        if (result.status) {

          localStorage.setItem("jwt", result.jwt);

          setTimeout(() => {
            navigate("/homepage");
          }, 500);

        } else {
          alert("Invalid Jwt token.");
        }
      }
    };

    fetchData();
  }, []);


  const [signinInfo, setSigninInfo] = useState({
    "email": "",
    "password": "",
  });

  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();

    try {

      const res = await fetch(URL, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signinInfo)
      });

      const result = await res.json();

      if (result.status) {

        localStorage.setItem("jwt", result.jwt);

        setTimeout(() => {
          navigate('/homepage');
        }, 500);

      } else {
        alert("Error occurred");
      }

    } catch (e) {
      console.error(e);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSigninInfo({
      ...signinInfo,
      [name]: value
    });
  }

  return (
    <div className="form-container">
      <h2>Login</h2>
      <div className="form-group">
        <input
          type="email"
          name='email'
          placeholder="Email"
          value={signinInfo.email}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          name='password'
          placeholder="Password"
          value={signinInfo.password}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <button onClick={handleSignin}>Sign In</button>
      </div>
      <div className="form-links">
        <Link to="/forgot-password">Forgot Password?</Link>
        <br />
        <Link to="/signup">Don't have an account? Sign up</Link>
      </div>
    </div>
  );
};