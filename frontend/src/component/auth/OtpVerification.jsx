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
  const fullName = localStorage.getItem("fullName");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  };
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUploadImage = async () => {
    if (!image) {
      showError("Please select an image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("email", email);
      formData.append("fullName", fullName);

      const URL = `${Constant.BASE_URL}/auth/upload-image`; // Replace with your actual API endpoint for image upload

      const res = await fetch(URL, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.status) {
        setUploadMessage(
          "Your request has been sent to the admin for approval."
        );
        // Optionally, clear the image state
        setImage(null);
      } else {
        showError(result.message || "Error uploading image.");
      }
    } catch (e) {
      console.error(e);
      showError("An error occurred while uploading the image.");
    } finally {
      setLoading(false);
    }
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
        } else if (verificationType === "forgotPassword") {
          navigate("/homepage"); // Redirect to home page for forgot password
        } else if (verificationType === "STUDENT") {
          navigate("/homepage");
        } else if (verificationType === "ALUMNI") {
          // Handle alumni case: Ask for image upload
          // setAlumniVerification(true);
         navigate("/verifyalumni");
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
      {uploadMessage && <div className="success-message">{uploadMessage}</div>}
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
