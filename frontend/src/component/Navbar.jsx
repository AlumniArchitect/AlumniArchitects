import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaEnvelope,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaTrash,
  FaCommentDots
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../style/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  let timeoutId = useRef(null);
  const navigate = useNavigate();

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
      <div className="navbar">
        <div className="profile-section" onClick={toggleMenu} ref={menuRef}>
          <div className="p-img">
            <img src="fenil.jpg" alt="Profile" />
          </div>
          <div className="p-name">USERNAME</div>
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
                <FaSignOutAlt />
                &nbsp; Logout
              </li>
              <li>
                <FaTrash />
                &nbsp; Delete Account
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
