import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import "../../style/HomePage/ProfileCompletion.css";

const ProfileCompletionMessage = () => {
  const navigate = useNavigate();
  const [profileProgress, setProfileProgress] = useState(
    localStorage.getItem("profileProgress") || 0
  );
  const [showProfileMessage, setShowProfileMessage] = useState(true);

  useEffect(() => {
    if (profileProgress < "100") {
      setShowProfileMessage(true);
    }
  }, [profileProgress]);

  const handleMessageClick = () => {
    navigate("/profile");
  };

  const handleCancelClick = () => {
    setShowProfileMessage(false);
  };

  return (
    <>
      {profileProgress < "100" && showProfileMessage && (
        <div className="incomplete-profile-message">
          <span onClick={handleMessageClick} style={{ cursor: "pointer" }}>
            You have not completed your profile.
          </span>
          <FaTimes className="cancel-icon" onClick={handleCancelClick} />
        </div>
      )}
    </>
  );
};

export default ProfileCompletionMessage;
