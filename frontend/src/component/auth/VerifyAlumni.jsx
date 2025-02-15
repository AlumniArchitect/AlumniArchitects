import React, { useState } from "react";
import Constant from "../../utils/Constant";
import "../../style/auth/VerifyAlumni.css";

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
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", image);

      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        setError("You are not authenticated. Please log in.");
        return;
      }

      const email = localStorage.getItem("email");
      if (!email) {
        setError("Email not found. Please log in again.");
        return;
      }

      const URL = `${Constant.BASE_URL}/upload-verification-img/${email}`;

      const res = await fetch(URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      });

      if (res.ok) {
        setMessage("Your ID proof has been uploaded successfully. Admin will verify it shortly.");
        setImage(null);
      } else {
        const result = await res.json();
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
      <div className="verifyalumni-form-group">
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
      {message && <div className="verifyalumni-success-message">{message}</div>}
      {error && <div className="verifyalumni-error-message">{error}</div>}
    </div>
  );
};

export default VerifyIdProof;