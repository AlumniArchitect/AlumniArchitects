import { useState } from "react";
import { AlertTriangle, HelpCircle, Mail, Trash2, Shield } from "lucide-react";
import "../../style/navbar/Setting.css";

export default function Setting() {
  const [selectedOption, setSelectedOption] = useState("Select an option");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const contentMap = {
    "Report Bug": "If you encounter any issues, please report them using this section.",
    "FAQ": "Find answers to commonly asked questions here.",
    "Contact Us": "Get in touch with our support team for further assistance.",
    "Privacy Policy": "Review our privacy policy to understand how we handle your data.",
    "Delete Account": "Are you sure you want to delete your account? This action cannot be undone.",
  };

  const handleDeleteAccount = () => {
    setSelectedOption("Delete Account");
    setShowConfirmation(true);
  };

  const handleConfirmation = (confirmed) => {
    if (confirmed) {
      alert("Account deleted successfully!");
    } else {
      alert("Account deletion cancelled.");
    }
    setShowConfirmation(false);
    setSelectedOption("Select an option");
  };

  return (
    <div className="settings-container">
      <div className="sidebar">
        <div className="card">
          <h2 className="title">Settings</h2>
          <div className="button-group">
            <button className="button" onClick={() => setSelectedOption("Report Bug")}>
              <AlertTriangle size={18} /> Report Bug
            </button>
            <button className="button" onClick={() => setSelectedOption("FAQ")}>
              <HelpCircle size={18} /> FAQ
            </button>
            <button className="button" onClick={() => setSelectedOption("Contact Us")}>
              <Mail size={18} /> Contact Us
            </button>
            <button className="button" onClick={() => setSelectedOption("Privacy Policy")}>
              <Shield size={18} /> Privacy Policy
            </button>
            <button className="button delete" onClick={handleDeleteAccount}>
              <Trash2 size={18} /> Delete Account
            </button>
          </div>
        </div>
      </div>
      
      <div className="content-area">
        <div className="card">
          <h2 className="title">{selectedOption}</h2>
          <div className="card-content">
            <p>{contentMap[selectedOption] || "Select an option to see details."}</p>
            {showConfirmation && (
              <div className="confirmation-dialog">
                <p>Are you sure you want to delete your account?</p>
                <div className="confirmation-buttons">
                  <button className="button confirm" onClick={() => handleConfirmation(true)}>
                    Yes
                  </button>
                  <button className="button cancel" onClick={() => handleConfirmation(false)}>
                    No
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