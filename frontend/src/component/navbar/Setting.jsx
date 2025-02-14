import React, { useState } from "react";
import { AlertTriangle, HelpCircle, Mail, Trash2, Shield } from "lucide-react";
import "../../style/navbar/Setting.css";
import Constant from "../../utils/Constant.js";
import { useNavigate } from "react-router-dom";

export default function Setting() {
  const [selectedOption, setSelectedOption] = useState("Select an option");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [bugReport, setBugReport] = useState({
    title: "",
    description: "",
    image: null,
  });

  // FAQ Data
  const faqs = [
    {
      question: "How do I update my profile?",
      answer:
        "To update your profile, go to the 'Profile' section and click on 'Edit'. Make the necessary changes and save them.",
    },
    {
      question: "How can I register for an event?",
      answer:
        "You can register for events by visiting the 'Events' page and clicking on the 'Register Now' button for the desired event.",
    },
    {
      question: "What should I do if I forget my password?",
      answer:
        "If you forget your password, click on the 'Forgot Password' link on the login page and follow the instructions sent to your email.",
    },
    {
      question: "How do I delete my account?",
      answer:
        "To delete your account, go to the 'Settings' page and select the 'Delete Account' option. Follow the prompts to confirm deletion.",
    },

    {
      question: " How do I register on the Alumni Portal?",
      answer:
        "To register, click on the Sign Up or Register button on the homepage. Fill out the registration form with your details. After submitting the form, you may need to verify your email address by OTP to complete the registration.",
    },
    {
      question: "  How can I find and connect with other alumni?",
      answer:
        "The Alumni Portal offers a directory or search function where you can find other alumni. You can search by name. Once you find alumni you'd like to connect with, you can send them a message through the portal or connect with them on professional networking platforms like LinkedIn.",
    },
    {
      question: " How do I join alumni events and activities?",
      answer:
        " Upcoming alumni events and activities are usually listed on the Events page of the Alumni Portal. You can browse the events calendar, view details about each event, and register to attend. Some events may require prior registration or a fee.",
    },
    {
      question:
        " How can I contribute to the Alumni Association or the university?",
      answer:
        "If you'd like to give back, the Alumni Portal usually has a Giving or Donate section. You can learn about different ways to contribute, such as making a financial donation, volunteering your time, or providing scholarships.",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBugReport((prevReport) => ({
      ...prevReport,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setBugReport((prevReport) => ({
      ...prevReport,
      image: e.target.files[0],
    }));
  };

  const handleSubmitBugReport = (e) => {
    e.preventDefault();
    console.log("Bug Report Submitted:", bugReport);
    // TODO: Implement your logic to handle the bug report submission
    // You can send the data to an API endpoint or perform other actions here
  };

  // Content Map
  const contentMap = {
    "Report Bug": (
      <>
        <div className="report-bug-form">
          <h3>Report a Bug</h3>
          <form onSubmit={handleSubmitBugReport}>
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={bugReport.title}
                onChange={handleInputChange}
                placeholder="Enter bug title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={bugReport.description}
                onChange={handleInputChange}
                placeholder="Enter bug description"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="image">Image:</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <button type="submit" className="submit-button">
              Submit Bug Report
            </button>
          </form>
        </div>
        <div className="report-bug-email">
          <p>Or, you can report a bug via email:</p>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=alumniarchitect@gmail.com&su=Bug Report&body=Describe the issue here..."
            target="_blank"
            rel="noopener noreferrer"
            className="mail-link"
          >
            <Mail size={18}/> &nbsp;Click here to report a bug via email.
          </a>
        </div>
      </>
    ),

    FAQ: (
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <details key={index} className="faq-item">
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    ),
    "Contact Us": (
      <div className="contact-info">
        <p>
          <strong>Email:</strong>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=alumniarchitect@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            alumniarchitect@gmail.com
          </a>
        </p>
        <p>
          <strong>Phone:</strong> +91 99740 01452
        </p>
        <p>
          <strong>Instagram:</strong>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            @alumni_portal
          </a>
        </p>
        <p>
          <strong>LinkedIn:</strong>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Alumni Portal LinkedIn
          </a>
        </p>
      </div>
    ),
    "Privacy Policy": (
      <div className="privacy-policy">
        <h3>Privacy Policy</h3>
        <p>
          At Alumni Portal, we are committed to protecting your privacy. This
          Privacy Policy explains how we collect, use, and safeguard your
          personal information.
        </p>
        <h4>Information We Collect</h4>
        <ul>
          <li>
            <strong>Personal Information:</strong> We may collect your name,
            email address, phone number, and other details when you create an
            account or interact with our services.
          </li>
          <li>
            <strong>Usage Data:</strong> We collect information about how you
            interact with our platform, such as pages visited and features used.
          </li>
        </ul>
        <h4>How We Use Your Information</h4>
        <ul>
          <li>To provide and maintain our services.</li>
          <li>To improve user experience and develop new features.</li>
          <li>
            To communicate with you regarding updates, events, and support.
          </li>
        </ul>
        <h4>Data Security</h4>
        <p>
          We implement industry-standard security measures to protect your data
          from unauthorized access, alteration, or disclosure.
        </p>
        <h4>Contact Us</h4>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at 
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=alumniarchitect@gmail.com" target="blank"
          rel="noopener noreferrer">
            alumniarchitect@gmail.com
          </a>
          .
        </p>
      </div>
    ),
    "Delete Account":
      "Are you sure you want to delete your account? This action cannot be undone.",
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  const handleDeleteAccount = () => {
    setSelectedOption("Delete Account");
    setShowConfirmation(true);
  };

  const handleConfirmation = async () => {
    const email = localStorage.getItem("email");
    const URL = `${Constant.BASE_URL}/auth/deleteAccount?email=${email}`;

    const deleteAccount = async () => {
      try {
        const res = await fetch(URL, { method: "DELETE" });
        if (!res.ok) {
          const errorData = await res.json();
          showError(errorData.message || "Something went wrong.");
          return;
        }
        const data = await res.json();
        if (data.status) {
          localStorage.clear();
          showError("Account deleted successfully");
          navigate("/signin");
        } else {
          showError(data.message);
        }
      } catch (error) {
        showError("Network error, please try again.");
      }
    };

    if (email) deleteAccount();
  };

  return (
    <div className="settings-container">
      {error && <div className="setting-message">{error}</div>}
      <div className="setting-sidebar">
        <div className="setting-card">
          <h2 className="setting-title">Settings</h2>
          <div className="setting-button-group">
            <button
              className="setting-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedOption("Report Bug");
              }}
            >
              <AlertTriangle size={18} /> Report Bug
            </button>
            <button
              className="setting-button"
              onClick={() => setSelectedOption("FAQ")}
            >
              <HelpCircle size={18} /> FAQ
            </button>
            <button
              className="setting-button"
              onClick={() => setSelectedOption("Contact Us")}
            >
              <Mail size={18} /> Contact Us
            </button>
            <button
              className="setting-button"
              onClick={() => setSelectedOption("Privacy Policy")}
            >
              <Shield size={18} /> Privacy Policy
            </button>
            <button
              className="setting-button setting-delete"
              onClick={handleDeleteAccount}
            >
              <Trash2 size={18} /> Delete Account
            </button>
          </div>
        </div>
      </div>
      <div className="setting-content-area">
        <div className="setting-card">
          <h2 className="setting-title">{selectedOption}</h2>
          <div className="setting-card-content">
            {contentMap[selectedOption] || "Select an option to see details."}
            {selectedOption === "Delete Account" && showConfirmation && (
              <div className="setting-confirmation-dialog">
                <div className="setting-confirmation-buttons">
                  <button
                    className="setting-button setting-confirm"
                    onClick={handleConfirmation}
                  >
                    Yes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
