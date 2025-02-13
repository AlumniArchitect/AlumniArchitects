import React, { useState, useEffect } from "react";
import Constant from "../../utils/Constant";
import defaultProfileImage from "../../assets/userLogo.png";
import "../../style/navbar/Profile.css";
import { useLocation } from "react-router-dom";
import UserSuggestion from "./UserSuggestion";

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
  const location = useLocation();
  const email = location.state?.email || "No email found";
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "",
    profileImageUrl: defaultProfileImage,
  });
  const [user, setUser] = useState({
    email: email || null,
    fullName: localStorage.getItem("fullName") || "N/A",
    mobileNumber: "+91",
    location: "",
    education: [], // Initialize as an empty array
    skills: [],
    resumeUrl: null,
    profileImageUrl: defaultProfileImage,
    socialLinks: [],
  });
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [error, setError] = useState("");
  const userEmail = localStorage.getItem("email");
  const jwt = localStorage.getItem("jwt");

  const calculateProfileProgress = () => {
    let completedFields = 0;
    const totalFields = 6; 
 
    if (user.fullName && user.fullName !== "N/A") completedFields++;
    if (user.mobileNumber && user.mobileNumber !== "+91") completedFields++;
    if (user.education && user.education.length > 0) completedFields++;
    if (user.skills && user.skills.length > 0) completedFields++;
    if (user.resumeUrl) completedFields++;
    if (user.socialLinks && user.socialLinks.length > 0) completedFields++;
 
    return Math.round((completedFields / totalFields) * 100); 
  };
 
  const profileProgress = calculateProfileProgress();
 
  useEffect(() => {
    localStorage.setItem("profileProgress", profileProgress);
  }, [profileProgress]);

  const handleEducationChange = (index, field, value) => {
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
    if (!Array.isArray(user.education)) {
      setUser({ ...user, education: [] }); // Ensure education is an array
      return;
    }
    const updatedEducation = user.education.filter((_, i) => i !== index);
    setUser({ ...user, education: updatedEducation });
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`${Constant.BASE_URL}/api/userProfile/${email}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user profile");
        const data = await res.json();
        if (data.status) {
          setUser((prevUser) => ({
            ...prevUser,
            ...data.userProfile,
            fullName: data.userProfile.fullName || "N/A",
            education: data.userProfile.education || [], // Ensure education is an array
          }));
          setUserProfile((prev) => ({
            ...prev,
            name: data.userProfile.fullName || "N/A",
          }));
        } else {
          showError(data.message);
        }
      } catch (err) {
        showError("Error: " + err.message);
      }
    };

    if (jwt) {
      fetchUserProfile();
    }
  }, [email, jwt]);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      showError("Please provide a file");
      return;
    }

    if (!file.type.startsWith('image/')) {
      showError("Please upload an image file");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${Constant.BASE_URL}/api/userProfile/uploadProfileImage/${email}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload image");
    }

    const data = await response.json();
    const imageUrl = data;
    console.log(imageUrl);

    setUser((prevUser) => ({ ...prevUser, profileImageUrl: imageUrl }));
    localStorage.setItem("profileImageUrl", imageUrl);
  };

  const handleSave = async () => {
    try {
      const updatedUser = {
        ...user,
        fullName: userProfile.name || user.fullName,
      };

      const res = await fetch(`${Constant.BASE_URL}/api/userProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(updatedUser),
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
    <div className={`profile-container ${isEditing ? "editing-mode" : ""}`}>
      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Sidebar */}
      <div className="profile-sidebar">
        <div className="profile-content">
          {/* Profile Photo */}
          <div
            className="profile-photo"
            onClick={() => setShowPhotoOptions(true)}
            style={{
              backgroundImage: user.profileImageUrl ? `url('${user.profileImageUrl}')` : "none",
            }}
          >
            {!user.profileImageUrl && <span className="photo-placeholder">+</span>}
          </div>
          {showPhotoOptions && (
            <label className="photo-btn">
              Change Photo
              <input type="file" className="hidden-input" onChange={handleFileUpload} />
            </label>
          )}

          {/* User Name */}
          {isEditing ? (
            <input
              className="input-field"
              value={userProfile.name || ""}
              placeholder="Enter name"
              onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
            />
          ) : (
            <h2 className="profile-name">{userProfile.name || "No name found"}</h2>
          )}

          {/* Email */}
          <p className="profile-email">{user.email || "No email found"}</p>

          {/* Mobile Number */}
          {isEditing ? (
            <input
              className="input-field"
              placeholder="Enter Mobile Number"
              value={user.mobileNumber || ""}
              onChange={(e) => setUser({ ...user, mobileNumber: e.target.value })}
            />
          ) : (
            <p className="profile-info">{user.mobileNumber}</p>
          )}

          {/* Resume URL */}
          {isEditing ? (
            <input
              className="input-field"
              placeholder="Enter Resume URL"
              value={user.resumeUrl || ""}
              onChange={(e) => setUser({ ...user, resumeUrl: e.target.value })}
            />
          ) : (
            <div className="profile-info">
              <a href={user.resumeUrl || "#"} target="_blank" rel="noopener noreferrer">
                Resume
              </a>
            </div>
          )}

          {/* Save/Edit Button */}
          {userEmail === email && (
            <button className="edit-btn" onClick={isEditing ? handleSave : () => setIsEditing(true)}>
              {isEditing ? "Save" : "Edit"}
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-main">
        {/* Education Section */}
        <div className="profile-section">
          <h3 className="section-title">Education</h3>
          {isEditing ? (
            <div>
              {user.education?.map((edu, index) => (
                <div key={index} className="education-edit">
                  <input
                    className="input-field"
                    placeholder="Type"
                    value={edu.type || ""}
                    onChange={(e) => handleEducationChange(index, "type", e.target.value)}
                  />
                  <input
                    className="input-field"
                    placeholder="Name"
                    value={edu.name || ""}
                    onChange={(e) => handleEducationChange(index, "name", e.target.value)}
                  />
                  <input
                    className="input-field"
                    placeholder="Year"
                    value={edu.year || ""}
                    onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                  />
                  <input
                    className="input-field"
                    placeholder="CGPA"
                    value={edu.cgpa || ""}
                    onChange={(e) => handleEducationChange(index, "cgpa", e.target.value)}
                  />
                  <button className="remove-btn" onClick={() => handleRemoveEducation(index)}>
                    Remove
                  </button>
                </div>
              ))}
              <button className="add-btn" onClick={handleAddEducation}>
                Add Education
              </button>
            </div>
          ) : user.education?.length > 0 ? (
            <div className="education-grid">
              {user.education.map((edu, index) => (
                <EducationCard key={index} education={edu} />
              ))}
            </div>
          ) : (
            <p>No Education added.</p>
          )}
        </div>

        {/* Skills Section */}
        <div className="profile-section">
          <h3 className="section-title">Skills</h3>
          {isEditing ? (
            <input
              className="input-field"
              value={user.skills?.join(", ") || ""}
              onChange={(e) =>
                setUser({
                  ...user,
                  skills: e.target.value.split(",").map((s) => s.trim().toUpperCase()),
                })
              }
            />
          ) : user.skills?.length > 0 ? (
            <div className="skills-container">
              {user.skills.map((skill, index) => (
                <span key={index} className="skill-badge">
                  {skill.toUpperCase()}
                </span>
              ))}
            </div>
          ) : (
            <p>No Skills Found.</p>
          )}
        </div>

        {/* Social Links Section */}
        <div className="profile-section">
          <h3 className="section-title">Social Links</h3>
          {isEditing ? (
            <input
              className="input-field"
              placeholder="Enter social links (comma separated)"
              value={user.socialLinks?.join(", ") || ""}
              onChange={(e) =>
                setUser({
                  ...user,
                  socialLinks: e.target.value.split(",").map((s) => s.trim()),
                })
              }
            />
          ) : user.socialLinks?.length > 0 ? (
            <ul className="social-links">
              {user.socialLinks.map((link, index) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No social links added</p>
          )}
        </div>

        {/* User Suggestions */}
        <UserSuggestion email={email} />
      </div>
    </div>
  );
};

export default ProfilePage;