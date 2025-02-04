import React, { useState } from "react";
import Navbar from "../component/Navbar";
import 

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "Alumni Architect",
    email: "alumniarchitect@example.com",
    profileImageUrl: "https://alumniarchitect.com/150",
    bio: "Web Developer | Tech Enthusiast",
    location: "New York, USA",
    resumeUrl: "",
    socialLink: "",
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };
  
  return (
    <div>
      <Navbar />
      <div className="profile-container" id="profile">
        <div className="profile-card">
          <div className="profile-photo-section">
            <img
              src={user.profileImageUrl}
              alt="Profile"
              className="profile-photo"
            />
          </div>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="profile-input"
          />
          <textarea
            name="bio"
            value={user.bio}
            onChange={handleChange}
            className="profile-textarea"
          />
          <div className="profile-details">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="profile-input"
            />
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={user.location}
              onChange={handleChange}
              className="profile-input"
            />
            <label>Resume URL:</label>
            <input
              type="text"
              name="resumeUrl"
              value={user.resumeUrl}
              onChange={handleChange}
              className="profile-input"
            />
            <label>Profile Image URL:</label>
            <input
              type="text"
              name="profileImageUrl"
              value={user.profileImageUrl}
              onChange={handleChange}
              className="profile-input"
            />
            <label>Social Link:</label>
            <input
              type="text"
              name="socialLink"
              value={user.socialLink}
              onChange={handleChange}
              className="profile-input"
            />
            <label>Skills:</label>
            <input
              type="text"
              name="skills"
              value={user.skills}
              onChange={handleChange}
              className="profile-input"
            />
          </div>
          <button
            onClick={() => alert("Profile saved successfully!")}
            className="save-button"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
