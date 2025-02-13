import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import "../../style/footer/Footer.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {

    const navigate = useNavigate();

    const handeleEvents = () => {
        navigate("/event");
    };
    const handeleAboutUs = () => {
        navigate("/");
    };
    const handeleResources = () => {
        navigate("/resource");
    };



    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h2 className="footer-title">AlumniArchite</h2>
                    <p className="footer-text">
                        Connecting alumni worldwide, fostering professional growth, and building lasting relationships.
                    </p>
                </div>

                <div className="footer-section">
                    <h3 className="footer-heading">Quick Links</h3>
                    <ul className="footer-links">
                        <li onClick={handeleAboutUs}>About Us</li>
                        <li onClick={handeleEvents}>Events</li>
                        <li onClick={handeleResources}>Resources</li>
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
                &copy; {new Date().getFullYear()} AlumniArchite. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;