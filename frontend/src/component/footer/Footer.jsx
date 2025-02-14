import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import "../../style/footer/Footer.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {

    const navigate = useNavigate();

    const handleEvents = () => {
        navigate("/event");
    };
    const handleAboutUs = () => {
        navigate("/");
    };
    const handleResources = () => {
        navigate("/resource");
    };
    const handleBlogs = ()=>{
        navigate("/blog")
    }


    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h2 className="footer-title">AlumniArchitect</h2>
                    <p className="footer-text">
                        Connecting alumni worldwide, fostering professional growth, and building lasting relationships.
                    </p>
                </div>

                <div className="footer-section">
                    <h3 className="footer-heading">Quick Links</h3>
                    <ul className="footer-links">
                        <li onClick={handleAboutUs}>About Us</li>
                        <li onClick={handleEvents}>Events</li>
                        <li onClick={handleResources}>Resources</li>
                        <li onClick={handleBlogs}>Blogs</li>
                        <li>Contact:  <u>alumniarchitect@gmail.com</u></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3 className="footer-heading">Follow Us</h3>
                    <div className="footer-socials">
                        <a href="#" className="social-icon"><FaFacebookF /></a>
                        <a href="#" className="social-icon"><FaTwitter /></a>
                        <a href="#" className="social-icon"><FaLinkedinIn /></a>
                        <a href="#" className="social-icon"><FaInstagram /></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} AlumniArchitect. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;