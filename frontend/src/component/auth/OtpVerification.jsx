import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Constant from "../../utils/Constant";
import "../../style/auth/OtpVerification.css";

export default function OtpVerification() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Determine the type of verification
  const verificationType = state?.type || ""; // Expecting 'forgotPassword', 'signup', 'signin', or 'admin'

  const email = localStorage.getItem("email");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  const handleOnClick = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!otp || (verificationType === "forgotPassword" && !newPassword)) {
      showError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const URL = `${Constant.BASE_URL}/auth/verify-otp`;

      const payload = { email, otp };
      if (verificationType === "forgotPassword")
        payload.newPassword = newPassword;

      const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.status) {
        localStorage.setItem("jwt", result.jwt);

        // Redirect based on verification type
        if (verificationType === "admin") {
          navigate("/admin"); // Redirect to admin page
        } else {
          navigate("/"); // Redirect to home page for other types
        }
      } else {
        showError(result.message || "Error occurred");
      }
    } catch (e) {
      console.error(e);
      showError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container--main">
      {error && <div className="error-message">{error}</div>}
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
          {verificationType === "forgotPassword" && (
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
