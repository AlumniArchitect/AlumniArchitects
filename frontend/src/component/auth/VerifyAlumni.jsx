import React, { useState } from "react";
import Constant from "../../utils/Constant"; // Adjust the import based on your project structure
import "../../style/auth/VerifyAlumni.css"; // Add your CSS file for styling

const VerifyIdProof = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUploadImage = async () => {
    if (!image) {
      setError("Please select an image.");
      return;
    }

    setLoading(true);
    setMessage(""); // Reset message before upload
    setError(""); // Reset error before upload

    try {
      const formData = new FormData();
      formData.append("image", image);

      const URL = `${Constant.BASE_URL}/auth/upload-id-proof`; // Adjust the URL based on your backend API

      const res = await fetch(URL, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.status) {
        setMessage("Your request has been sent to the admin for approval.");
        // Optionally, clear the image state
        setImage(null);
      } else {
        setError(result.message || "Error uploading image.");
      }
    } catch (e) {
      console.error(e);
      setError("An error occurred while uploading the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-id-proof-container">
      <h2>Verify Your ID Proof</h2>
      <div className="form-group">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="Image"
          required
        />
        <button onClick={handleUploadImage} disabled={loading}>
          {loading ? "Uploading..." : "Upload ID Proof"}
        </button>
      </div>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default VerifyIdProof;
