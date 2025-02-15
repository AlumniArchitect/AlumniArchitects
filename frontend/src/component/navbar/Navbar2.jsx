import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../../style/navbar/Navbar2.css";
import { IoHome } from "react-icons/io5";

const Navbar2 = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const navItems = [
    {path: "/homepage", label: <IoHome />},
    { path: "/profile", label: "Profile" },
    { path: "/event", label: "Event" },
    { path: "/blog", label: "Blog" },
    { path: "/resource", label: "Resource Library" },
    { path: "/referral", label: "Referral" },
    { path: "/setting", label: "Setting" },
  ];

  return (
    <nav className="nav2-navbar">
      <ul className="nav2-list">
        {navItems.map((item) => (
          <li key={item.path} className="nav2-item">
            <NavLink
              to={item.path}
              className={`nav2-link ${activeLink === item.path ? "nav2-active" : ""}`}
              onClick={() => setActiveLink(item.path)}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar2;