import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Constant from "../../utils/Constant";
import "../../style/auth/OtpVerification.css";

export default function OtpVerification() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const isForgotPassword = state?.isForgotPassword || false;

  const email = localStorage.getItem("email");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOnClick = async () => {
    if (!otp || (isForgotPassword && !newPassword)) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

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
        alert(result.message || "Error occurred");
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
        <h2>OTP Verification</h2>
        <form>
          <div className="form-group">
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          {isForgotPassword && (
            <div className="form-group">
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          )}
          <div className="form-group">
            <button onClick={handleOnClick} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}