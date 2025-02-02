import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Constant from "../../utils/Constant";
import "../../style/auth/SignIn.css";

export default function Signin() {
  const URL = `${Constant.BASE_URL}/auth/signin`;
  const navigate = useNavigate();
  const [signinInfo, setSigninInfo] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  useEffect(() => {
    const fetchData = async () => {
      const jwt = localStorage.getItem("jwt");

      if (jwt) {
        try {
          const res = await fetch(URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
          });

          const result = await res.json();

          if (result.status) {
            navigate("/homepage");
          } else {
            showError("Invalid JWT token. Please log in again.");
            localStorage.removeItem("jwt");
          }
        } catch (error) {
          showError("Error validating JWT:", error);
        }
      }
    };

    fetchData();
  }, [URL, navigate]);

  const handleSignin = async (e) => {
    e.preventDefault();

    if (!signinInfo.email || !signinInfo.password) {
      showError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signinInfo),
      });

      const result = await res.json();

      if (result.status) {

        localStorage.setItem("email", signinInfo.email);
        localStorage.setItem("jwt", result.jwt);

        navigate("/homepage");
      } else {
        showError("Error : " + result.message);
      }
    } catch (error) {
      showError("Error : ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSigninInfo({
      ...signinInfo,
      [name]: value,
    });
  };

  return (
    <div className="form-container--main">
      {error && <div className="error-message">{error}</div>}
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleSignin}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signinInfo.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signinInfo.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <button type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>
        <div className="form-links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <br />
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="signup-link"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
