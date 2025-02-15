import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Constant from "../../utils/Constant";
import "../../style/auth/SignIn.css";

export default function Signin() {
  const navigate = useNavigate();
  const [signinInfo, setSigninInfo] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("user");
  const jwt = localStorage.getItem("jwt") || null;

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (jwt && role === "user") {
        try {
          const res = await fetch(`${Constant.BASE_URL}/auth/user/signin`, {
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
            localStorage.removeItem("jwt");
          }
        } catch (error) {
          console.log("Error");
        }
      }
    };

    fetchData();
  }, [role]);

  const handleSignin = async (e) => {
    e.preventDefault();

    if (!signinInfo.email || !signinInfo.password) {
      showError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const URL = role === "admin" ? "/auth/admin/signin" : "/auth/user/signin";
      const res = await fetch(`${Constant.BASE_URL}${URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signinInfo),
      });

      if (role === "admin") {
        const result = await res.json();
        if (result) {
          localStorage.setItem("jwt", jwt);
          localStorage.setItem("email", signinInfo.email);
          navigate("/adminpanel");
        } else {
          showError("Invalid admin credentials.");
        }
      } else {
        const result = await res.json();
        if (result.status) {
          localStorage.setItem("email", signinInfo.email);
          localStorage.setItem("jwt", result.jwt);
          navigate("/homepage");
        } else {
          showError("Error : " + result.message);
        }
      }
    } catch (error) {
      showError(`Error: ${error.message || "Some error occurred."}`);
    } finally {
      setLoading(false);
    }
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
              onChange={(e) => setSigninInfo({ ...signinInfo, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signinInfo.password}
              onChange={(e) => setSigninInfo({ ...signinInfo, password: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
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