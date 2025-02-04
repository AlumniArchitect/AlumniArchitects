import React, { useState } from "react";
import "../style/Profile.css";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("John Doe");
  const [mobile, setMobile] = useState("+123 456 7890");
  const [location, setLocation] = useState("New York, USA");
  const [education, setEducation] = useState("B.Sc. in Computer Science - XYZ University");
  const [skills, setSkills] = useState(["JavaScript", "React", "CSS", "HTML"]);
  const [resume, setResume] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [socialLinks, setSocialLinks] = useState({ linkedin: "", github: "", twitter: "" });
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  // Handle resume upload
  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setResume(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setPhoto(URL.createObjectURL(file));
      setShowPhotoOptions(false);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  // Save changes when exiting edit mode
  const handleSave = () => {
    setIsEditing(false);
    alert("Profile saved successfully!");
  };

  return (
    <div className="profile-container">
      {/* Left Section */}
      <div className="profile-sidebar">
        <div className="profile-content">
          {/* Profile Photo */}
          <div
            className="profile-photo"
            onClick={() => setShowPhotoOptions(true)}
            style={{
              backgroundImage: photo ? `url('${photo}')` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!photo && <span className="photo-placeholder">+</span>}
          </div>
          {showPhotoOptions && (
            <div className="photo-options">
              {!isEditing ? (
                <button className="photo-btn" onClick={() => setShowPhotoOptions(false)}>
                  View Photo
                </button>
              ) : (
                <label className="photo-btn">
                  Change Photo
                  <input type="file" className="hidden-input" onChange={handlePhotoUpload} />
                </label>
              )}
            </div>
          )}

          {/* Name */}
          {isEditing ? (
            <input
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <h2 className="profile-name">{name}</h2>
          )}

          {/* Email */}
          <p className="profile-email">johndoe@example.com</p>

          {/* Mobile */}
          {isEditing ? (
            <input
              className="input-field"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          ) : (
            <p className="profile-info">{mobile}</p>
          )}

          {/* Location */}
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
              <input type="file" className="hidden-input" onChange={handleResumeUpload} />
            </label>
          ) : (
            resume && <p className="resume-info">Uploaded Resume: {resume.name}</p>
          )}

          {/* Edit Button */}
          <button className="edit-btn" onClick={isEditing ? handleSave : () => setIsEditing(true)}>
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="profile-main">
        {/* Education */}
        <div className="profile-section">
          <h3 className="section-title">Education</h3>
          {isEditing ? (
            <input
              className="input-field"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            />
          ) : (
            <p className="profile-info">{education}</p>
          )}
        </div>

        {/* Skills */}
        <div className="profile-section">
          <h3 className="section-title">Skills</h3>
          {isEditing ? (
            <input
              className="input-field"
              value={skills.join(", ")}
              onChange={(e) => setSkills(e.target.value.split(",").map((skill) => skill.trim()))}
            />
          ) : (
            <div className="skills-container">
              {skills.map((skill, index) => (
                <span key={index} className="skill-badge">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="profile-section">
          <h3 className="section-title">Social Links</h3>
          {isEditing ? (
            <div>
              <input
                className="input-field"
                placeholder="LinkedIn URL"
                value={socialLinks.linkedin}
                onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
              />
              <input
                className="input-field"
                placeholder="GitHub URL"
                value={socialLinks.github}
                onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
              />
              <input
                className="input-field"
                placeholder="Twitter URL"
                value={socialLinks.twitter}
                onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
              />
            </div>
          ) : (
            <ul className="social-links">
              {socialLinks.linkedin && (
                <li>
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </li>
              )}
              {socialLinks.github && (
                <li>
                  <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </li>
              )}
              {socialLinks.twitter && (
                <li>
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
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