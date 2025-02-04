import React, { useEffect, useState } from "react";
import "../style/Profile.css";
import defaultProfileImage from "./assets/userLogo.png";
import Constant from "../utils/Constant";

const ProfilePage = () => {
  const [user, setUser] = useState({
    email: localStorage.getItem("email") || "",
    profileImageUrl: defaultProfileImage,
    bio: "",
    location: "",
    resumeUrl: "",
    socialLinks: [],
    skills: [],
  });
  const jwt = localStorage.getItem("jwt");
  const [error, setError] = useState(null);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user.email || !jwt) {
        showError("Invalid JWT or email");
        return;
      }

      try {
        const res = await fetch(`${Constant.BASE_URL}/api/userProfile/${user.email}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${jwt}` },
        });

        if (!res.ok) throw new Error("Failed to fetch user profile");

        const data = await res.json();
        if (data.status) {
          setUser((prevUser) => ({ ...prevUser, ...data.userProfile }));
        } else {
          showError(data.message);
        }
      } catch (err) {
        showError("Error: " + err.message);
      }
    };

    fetchUserProfile();
  }, [user.email, jwt]);

  const handleSave = async () => {
    try {
      const res = await fetch(`${Constant.BASE_URL}/api/userProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(user),
      });

      const data = await res.json();
      if (data.status) {
        alert("Profile updated successfully!");
      } else {
        setError(data.message)
        showError(error);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
      showError(err);
      setError(null);
    }
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <div className="profile-container" id="profile">
        <div className="profile-card">
          <div className="profile-photo-section">
            <img src={user.profileImageUrl} alt="Profile" className="profile-photo" />
          </div>
          <textarea name="bio" value={user.bio} onChange={handleChange} className="profile-textarea" />
          <div className="profile-details">
            <label>Email:</label>
            <input type="email" name="email" value={user.email} readOnly className="profile-input" />
            <label>Location:</label>
            <input type="text" name="location" value={user.location} onChange={handleChange} className="profile-input" />
            <label>Resume URL:</label>
            <input type="text" name="resumeUrl" value={user.resumeUrl} onChange={handleChange} className="profile-input" />
            <label>Social Links (comma-separated):</label>
            <input type="text" name="socialLinks" value={user.socialLinks} onChange={(e) => setUser({ ...user, socialLinks: e.target.value.split(",") })} className="profile-input" />
            <label>Skills (comma-separated):</label>
            <input type="text" name="skills" value={user.skills} onChange={(e) => setUser({ ...user, skills: e.target.value.split(",") })} className="profile-input" />
          </div>
          <button onClick={handleSave} className="save-button">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;