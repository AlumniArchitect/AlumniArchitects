import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Constant from "../../utils/Constant";
import "../../style/auth/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleResetPassword = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      const URL = `${Constant.BASE_URL}/auth/forgot-password?email=${email}`;

      const res = await fetch(URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (result.status) {
        localStorage.setItem("email", email);
        navigate("/verify-otp", { state: { isForgotPassword: true } });
      } else {
        alert(result.message);
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container--main">
      <div className="form-container">
        <h2>Forgot Password</h2>
        <div className="form-group">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <button onClick={handleResetPassword} disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>
      </div>
    </div >
  );
};

export default ForgotPassword;