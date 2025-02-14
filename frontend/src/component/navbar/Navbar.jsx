import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaEnvelope,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaExclamationCircle,
  FaBloggerB,
} from "react-icons/fa";
import { RiCalendarEventFill } from "react-icons/ri";
import { IoLibrary } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import "../../style/navbar/Navbar.css";
import Constant from "../../utils/Constant.js";
import defaultProfileImage from "../../assets/userLogo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "",
    profileImageUrl: defaultProfileImage,
  });
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const jwt = localStorage.getItem("jwt");
  const menuRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/splash-screen");
  };

  const handleProfileClick = () => {
    navigate("/profile", { state: { email } });
  };

  const handleSettingClick = () => {
    navigate("/setting");
  };

  const handleBlogClick = () => {
    navigate("/blog");
  };

  const handleEventClick = () => {
    navigate("/event");
  };

  const handleResourceClick = () => {
    navigate("/resource");
  };

  const handleReferralClick = () =>{
    navigate("/referral");
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
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
          localStorage.setItem("fullName", data.user.fullName);
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
        const res = await fetch(
          `${Constant.BASE_URL}/api/userProfile/${email}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch user profile image");
        const data = await res.json();
        if (data.status && data.userProfile.profileImageUrl) {
          setUserProfile((prev) => ({
            ...prev,
            profileImageUrl: data.userProfile.profileImageUrl,
          }));
          localStorage.setItem("profileImageUrl", data.userProfile.profileImageUrl);
        } else {
          showError("User image not found");
        }
      } catch (error) {
        showError("Error fetching user image: " + error.message);
      }
    };

    if (email) {
      fetchUserProfile();
      fetchUserProfileImage();
    }

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [email, jwt]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        fetchSearchResults(value);
      } else {
        setSearchResults([]);
      }
      setIsTyping(false);
    }, 700);
  };

  const fetchSearchResults = async (query) => {
    try {
      const res = await fetch(
        `${Constant.BASE_URL}/api/suggest/user?query=${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch search results");
      const data = await res.json();
      const usersArray = Object.entries(data).map(([email, fullName]) => ({ email, fullName }));

      setSearchResults(usersArray);
    } catch (error) {
      showError("Error fetching search results: " + error.message);
    }
  };

  const handleOpenProfile = (email) => {
    navigate("/profile", { state: { email } });
  };


  return (
    <nav>
      {error && (
        <div className="error-message">
          <FaExclamationCircle className="icon" /> {error}
        </div>
      )}
      <div className="nav-navbar">
        <div className="navbar-section" onClick={toggleMenu}>
          <div className="p-img">
            <img
              src={userProfile.profileImageUrl || defaultProfileImage}
              alt="Profile"
            />
          </div>
          <div className="p-name">{userProfile.name || "USERNAME"}</div>
        </div>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchResults.length > 0 && (
            <div className="search-results-container">
              <div className="search-results">
                {searchResults.map((user, index) => (
                  <div key={index} className="search-result-item" onClick={() => handleOpenProfile(user.email)}>
                    {user.fullName}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="nav-icons">
          <FaEnvelope className="icon" />
        </div>
        {menuOpen && (
          <div ref={menuRef} className="dropdown-menu">
            <div className="dropdown-profile">
              <div className="p-img">
                <img
                  src={userProfile.profileImageUrl || defaultProfileImage}
                  alt="Profile"
                />
              </div>
              <div className="p-name">{userProfile.name || "USERNAME"}</div>
            </div>
            <ul>
              <li onClick={handleProfileClick}>
                <FaUserCircle /> &nbsp; Profile
              </li>
              <li onClick={handleEventClick}>
              <RiCalendarEventFill />  &nbsp; Event</li>
              <li onClick={handleBlogClick}>
              <FaBloggerB /> &nbsp; Blog</li>
              <li onClick={handleResourceClick}>
              <IoLibrary /> &nbsp; Resource Library</li>
              <hr />
              <li onClick={handleReferralClick}>Referral </li>
              <hr />
              <li onClick={handleReferralClick}>Referral </li>
              <hr />
              <li onClick={handleReferralClick}>
                <FaCog /> &nbsp; Referrals
              </li>
              <li onClick={handleSettingClick}>
                <FaCog /> &nbsp; Settings
              </li>
              <li onClick={handleLogout} className="logout">
                <FaSignOutAlt /> &nbsp; Logout
              </li>
             

            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}