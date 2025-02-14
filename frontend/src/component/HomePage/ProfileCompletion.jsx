import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import "../../style/HomePage/ProfileCompletion.css";
import Constant from "../../utils/Constant.js";

const ProfileCompletionMessage = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const URL = Constant.BASE_URL;
  const jwt = localStorage.getItem("jwt");
  const [isProfileComplete, setIsProfileComplete] = useState(null);

  useEffect(() => {
    const fetchIsProfileComplete = async () => {
      try {
        const res = await fetch(`${URL}/api/userProfile/is-profile-complete/${email}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error("Error: " + errorText);
        }

        const data = await res.json();
        console.log(data);
        
        setIsProfileComplete(data);

      } catch (error) {
        console.error(error);
      }
    };

    if (isProfileComplete === null) {
      fetchIsProfileComplete();
    }

  }, [email]);

  const handleMessageClick = () => {
    navigate("/profile", { state: { email } });
  };

  const handleCancelClick = () => {
    setIsProfileComplete(true);
  };

  return (
    <>
      {isProfileComplete === false && (
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