import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Constant from "../../utils/Constant";

export default function OtpVerification() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const isForgotPassword = state?.isForgotPassword || false;

  const email = localStorage.getItem("email");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleOnClick = async () => {
    try {
      const URL = `${Constant.BASE_URL}/auth/verify-otp`;

      const payload = { email, otp };
      if (isForgotPassword) payload.newPassword = newPassword;

      const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.status) {
        localStorage.setItem("jwt", result.jwt);
        setTimeout(() => navigate("/signin"), 500);
      } else {
        alert("Error occurred");
      }
    } catch (e) {
      alert("An error occurred. Check the console.");
      console.error(e);
    }
  };

  return (
    <div id="verify-otp" className="form-group">
      <input
        type="text"
        name="Otp"
        id="Otp"
        placeholder="Enter Otp"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      {isForgotPassword && (
        <input
          type="password"
          name="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      )}

      <button onClick={handleOnClick}>Verify Otp</button>
    </div>
  );
}