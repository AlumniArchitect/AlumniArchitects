import React, { useState, useEffect } from "react";
import Constant from "../utils/Constant.js";
import defaultProfileImage from "./assets/userLogo.png";
import "../style/Profile.css";

const EducationCard = ({ education }) => {
  return (
    <div className="education-card">
      <h4 className="education-type">{education.type}</h4>
      <p className="education-name">{education.name}</p>
      <p className="education-year">Year: {education.year}</p>
      <p className="education-cgpa">CGPA: {education.cgpa}</p>
    </div>
  );
};

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "",
    profileImageUrl: defaultProfileImage,
  });
  const [user, setUser] = useState({
    email: localStorage.getItem("email") || null,
    mobileNumber: "N/A",
    location: "N/A",
    education: [],
    skills: [],
    resume: localStorage.getItem("resumeUrl") || "No resume link found",
    photo: localStorage.getItem("profileImageUrl") || defaultProfileImage,
    socialLinks: []
  });
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [error, setError] = useState("");
  const jwt = localStorage.getItem("jwt"); const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...user.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setUser({ ...user, education: updatedEducation });
  };

  const handleAddEducation = () => {
    setUser({
      ...user,
      education: [...user.education, { type: "", name: "", year: "", cgpa: "" }],
    });
  };

  const handleRemoveEducation = (index) => {
    const updatedEducation = user.education.filter((_, i) => i !== index);
    setUser({ ...user, education: updatedEducation });
  };

  useEffect(() => {
    const email = localStorage.getItem("email");

    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`${Constant.BASE_URL}/api/userProfile/${user.email}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user profile");

        const data = await res.json();

        if (data.status) {
          console.log(data);

          setUser((prevUser) => ({ ...prevUser, ...data.userProfile }));
        } else {
          showError(data.message);
        }
      } catch (err) {
        showError("Error: " + err.message);
      }
    };

    const fetchUserName = async () => {
      try {
        const res = await fetch(`${Constant.BASE_URL}/api/user/${email}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user profile");

        const data = await res.json();
        if (data.status) {
          setUserProfile((prev) => ({ ...prev, name: data.user.fullName }));
        } else {
          showError("User name not found");
        }
      } catch (error) {
        showError("Error fetching user name: " + error.message);
      }
    };

    if (email && jwt) {
      fetchUserName();
      fetchUserProfile();
    }
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
      {/* error */}
      {error && <div className="error-message">{error}</div>}

      <div className="profile-sidebar">
        <div className="profile-content">

          {/* profile photo */}
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

          {/* user name */}
          {isEditing ? (
            <input className="input-field" value={userProfile.name} onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })} />
          ) : (
            <h2 className="profile-name">{userProfile.name}</h2>
          )}

          {/* email */}
          <p className="profile-email">{user.email}</p>

          {/* mobile */}
          {isEditing ? (
            <input className="input-field" value={user.mobileNumber} onChange={(e) => setUser({ ...user, mobileNumber: e.target.value })} />
          ) : (
            <p className="profile-info">{user.mobileNumber}</p>
          )}

          {/* save and edit button */}
          <button className="edit-btn" onClick={isEditing ? handleSave : () => setIsEditing(true)}>
            {isEditing ? "Save" : "Edit"}
          </button>

        </div>

        {/* Education, Skill, Link */}
      </div>
      <div className="profile-main">
        <div className="profile-section">

          {/* education */}
          <h3 className="section-title">Education</h3>
          {isEditing ? (
            <div>
              {user.education.map((edu, index) => (
                <div key={index} className="education-edit">
                  <input
                    className="input-field"
                    placeholder="Type"
                    value={edu.type}
                    onChange={(e) => handleEducationChange(index, "type", e.target.value)}
                  />
                  <input
                    className="input-field"
                    placeholder="Name"
                    value={edu.name}
                    onChange={(e) => handleEducationChange(index, "name", e.target.value)}
                  />
                  <input
                    className="input-field"
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                  />
                  <input
                    className="input-field"
                    placeholder="CGPA"
                    value={edu.cgpa}
                    onChange={(e) => handleEducationChange(index, "cgpa", e.target.value)}
                  />
                  <button className="remove-btn" onClick={() => handleRemoveEducation(index)}>Remove</button>
                </div>
              ))}
              <button className="add-btn" onClick={handleAddEducation}>Add Education</button>
            </div>
          ) : (
            <div className="education-grid">
              {user.education.map((edu, index) => (
                <EducationCard key={index} education={edu} />
              ))}
            </div>
          )}
        </div>

        {/* skills */}
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

        {/* links */}
        <div className="profile-section">
          <h3 className="section-title">Social Links</h3>
          {isEditing ? (
            <input
              className="input-field"
              placeholder="Enter social links (comma separated)"
              value={user.socialLinks.join(", ")}
              onChange={(e) => setUser({ ...user, socialLinks: e.target.value.split(",").map(s => s.trim()) })}
            />
          ) : (
            <ul className="social-links">
              {user.socialLinks.length > 0 ? (
                user.socialLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {link}
                    </a>
                  </li>
                ))
              ) : (
                <p>No social links added</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
