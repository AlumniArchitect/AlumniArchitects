import React, { useState, useEffect } from "react";
import Constant from "../utils/Constant.js";
import "../style/Profile.css";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "",
    mobile: "",
    location: "",
    education: "",
    skills: [],
    resume: "",
    photo: "",
    socialLinks: {
      linkedin: "",
      github: "",
      twitter: "",
    },
  });
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [error, setError] = useState("");
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    const fetchUserProfile = async () => {
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
    if (jwt) fetchUserProfile();
  }, [user.email, jwt]);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      setUser((prevUser) => ({
        ...prevUser,
        [type]: type === "photo" ? URL.createObjectURL(file) : file.name,
      }));
    }
  };

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
        setIsEditing(false);
      } else {
        showError(data.message);
      }
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="profile-container">
      {error && <div className="error-message">{error}</div>}
      <div className="profile-sidebar">
        <div className="profile-content">
          <div className="profile-photo" onClick={() => setShowPhotoOptions(true)}
            style={{ backgroundImage: user.photo ? `url('${user.photo}')` : "none" }}>
            {!user.photo && <span className="photo-placeholder">+</span>}
          </div>
          {showPhotoOptions && (
            <label className="photo-btn">
              Change Photo
              <input type="file" className="hidden-input" onChange={(e) => handleFileUpload(e, "photo")} />
            </label>
          )}
          {isEditing ? (
            <input className="input-field" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
          ) : (
            <h2 className="profile-name">{user.name}</h2>
          )}
          <p className="profile-email">johndoe@example.com</p>
          {isEditing ? (
            <input className="input-field" value={user.mobile} onChange={(e) => setUser({ ...user, mobile: e.target.value })} />
          ) : (
            <p className="profile-info">{user.mobile}</p>
          )}
          <button className="edit-btn" onClick={isEditing ? handleSave : () => setIsEditing(true)}>
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
      </div>
      <div className="profile-main">
        <div className="profile-section">
          <h3 className="section-title">Education</h3>
          {isEditing ? (
            <input className="input-field" value={user.education} onChange={(e) => setUser({ ...user, education: e.target.value })} />
          ) : (
            <p className="profile-info">{user.education}</p>
          )}
        </div>
        <div className="profile-section">
          <h3 className="section-title">Skills</h3>
          {isEditing ? (
            <input className="input-field" value={user.skills.join(", ")} onChange={(e) => setUser({ ...user, skills: e.target.value.split(",").map((s) => s.trim()) })} />
          ) : (
            <div className="skills-container">
              {user.skills.map((skill, index) => (
                <span key={index} className="skill-badge">{skill}</span>
              ))}
            </div>
          )}
        </div>
        <div className="profile-section">
          <h3 className="section-title">Social Links</h3>
          {isEditing ? (
            <div>
              <input
                className="input-field"
                placeholder="LinkedIn URL"
                value={user.socialLinks.linkedin}
                onChange={(e) => setUser(prev => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                }))}
              />
              <input
                className="input-field"
                placeholder="GitHub URL"
                value={user.socialLinks.github}
                onChange={(e) => setUser(prev => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, github: e.target.value }
                }))}
              />
              <input
                className="input-field"
                placeholder="Twitter URL"
                value={user.socialLinks.twitter}
                onChange={(e) => setUser(prev => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                }))}
              />
            </div>
          ) : (
            <ul className="social-links">
              {user.socialLinks.linkedin && (
                <li>
                  <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </li>
              )}
              {user.socialLinks.github && (
                <li>
                  <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </li>
              )}
              {user.socialLinks.twitter && (
                <li>
                  <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
