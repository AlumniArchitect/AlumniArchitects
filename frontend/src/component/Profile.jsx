import React, { useState, useEffect } from "react";
import Constant from "../utils/Constant";
import "../style/Profile.css";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    email: "johndoe@example.com",
    profileImageUrl: "",
    resumeUrl: "",
    bio: "",
    socialLinks: { linkedin: "", github: "", twitter: "" },
    skills: ["JavaScript", "React", "CSS", "HTML"],
    location: "New York, USA",
    mobileNumber: "+123 456 7890",
    education: [{ type: "B.Sc.", name: "XYZ University", year: "2022", cgpa: 3.8 }],
  });
  const [resume, setResume] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-content">
          <div className="profile-photo" style={{ backgroundImage: photo ? `url('${photo}')` : "none" }}>
            {!photo && <span className="photo-placeholder">+</span>}
          </div>

          <h2 className="profile-name">{isEditing ? <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} /> : user.name}</h2>
          <p className="profile-email">{user.email}</p>

          {isEditing ? <input value={user.mobileNumber} onChange={(e) => setUser({ ...user, mobileNumber: e.target.value })} /> : <p>{user.mobileNumber}</p>}

          {isEditing ? <input value={user.location} onChange={(e) => setUser({ ...user, location: e.target.value })} /> : <p>{user.location}</p>}

          {isEditing ? (
            <input
              className="input-field"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          ) : (
            <p className="profile-info">{location}</p>
          )}

      
          {isEditing ? (
            <label className="file-input-label">
              Upload Resume
              <input type="file" onChange={(e) => handleFileUpload(e, "resume")} />
            </label>
          ) : (
            resume && <p>Uploaded Resume: {resume?.name || "Unknown file"}</p>
          )}

          <button className="edit-btn" onClick={isEditing ? handleSave : () => setIsEditing(true)}>{isEditing ? "Save" : "Edit"}</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
