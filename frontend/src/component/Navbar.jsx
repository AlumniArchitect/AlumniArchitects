import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaEnvelope,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaTrash,
  FaCommentDots,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../style/Navbar.css";
import Constant from "../utils/Constant.js";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({ name: "", profileImageUrl: "" });
  const [error, setError] = useState("");
  const menuRef = useRef(null);
  const timeoutId = useRef(null);
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const jwt = localStorage.getItem("jwt");

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    resetAutoCloseTimer();
  };

  const resetAutoCloseTimer = () => {
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      setMenuOpen(false);
    }, 10000);
  };

  useEffect(() => {
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

    const fetchUserProfileImage = async () => {
      try {
        const res = await fetch(`${Constant.BASE_URL}/api/userProfile/${email}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user profile image");

        const data = await res.json();
        if (data.status) {          
          setUserProfile((prev) => ({ ...prev, profileImageUrl: data.userProfile.profileImageUrl }));
        } else {
          showError("User image not found");
        }
      } catch (error) {
        showError("Error fetching user image: " + error.message);
      }
    };

    if (email) {
      fetchUserName();
      fetchUserProfileImage();
    }
    
  }, [email, jwt]);

  useEffect(() => {
    if (menuOpen) {
      resetAutoCloseTimer();
    }
    return () => clearTimeout(timeoutId.current);
  }, [menuOpen]);

  const handleLogout = (event) => {
    event.stopPropagation();
    localStorage.removeItem("jwt");
    setTimeout(() => {
      navigate("/signin");
    }, 100);
  };

  return (
    <nav>
      {error && <div className="error-message">{error}</div>}
      <div className="navbar">
        <div className="profile-section" onClick={toggleMenu} ref={menuRef}>
          <div className="p-img">
            <img src={userProfile.profileImageUrl} alt="Profile" />
          </div>
          <div className="p-name">{userProfile.name || "USERNAME"}</div>
        </div>

        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>

        <div className="nav-icons">
          <FaEnvelope className="icon" />
        </div>

        {menuOpen && (
          <div className="dropdown-menu">
            <ul>
              <li>
                <FaUserCircle /> &nbsp; Profile
              </li>
              <li>Option 1</li>
              <li>Option 2</li>
              <li>Option 3</li>
              <li>Option 4</li>
              <li>Option 5</li>
              <li>Option 6</li>
              <hr />
              <li>
                <FaCog /> &nbsp; Settings
              </li>
              <li onClick={handleLogout} className="logout">
                <FaSignOutAlt /> &nbsp; Logout
              </li>
              <li>
                <FaTrash /> &nbsp; Delete Account
              </li>
            </ul>
          </div>
        )}
      </div>
      <button className="chat-button">
        <FaCommentDots className="chat-icon" />
      </button>
    </nav>
  );
};

export default Navbar;