import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaEnvelope,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaTrash,
} from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  let timeoutId = useRef(null);


  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    resetAutoCloseTimer();
  };

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


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
              <li className="logout">
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
    </nav>
  );
};

export default Navbar;
