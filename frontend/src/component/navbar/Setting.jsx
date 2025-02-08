import { useState } from "react";
import { AlertTriangle, HelpCircle, Mail, Trash2, Shield } from "lucide-react";
import "../../style/navbar/Setting.css";
import Constant from "../../utils/Constant.js"
import { useNavigate } from "react-router-dom"

export default function Setting() {
  const [selectedOption, setSelectedOption] = useState("Select an option");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const contentMap = {
    "Report Bug": "If you encounter any issues, please report them using this section.",
    "FAQ": "Find answers to commonly asked questions here.",
    "Contact Us": "Get in touch with our support team for further assistance.",
    "Privacy Policy": "Review our privacy policy to understand how we handle your data.",
    "Delete Account": "Are you sure you want to delete your account? This action cannot be undone.",
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  const handleDeleteAccount = () => {
    setSelectedOption("Delete Account");
    setShowConfirmation(true);
  };

  const handleConfirmation = () => {
    const email = localStorage.getItem("email");
    const URL = `${Constant.BASE_URL}/auth/deleteAccount?email=${email}`

    const deleteAccount = async () => {
      try {
        const res = await fetch(URL, { method: "DELETE" });

        console.log(res);
        

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

    if(email) deleteAccount();
  }

  return (
    <div className="settings-container">
      {error && <div className="message">{error}</div>}
      <div className="setting-sidebar">
        <div className="setting-card">
          <h2 className="setting-title">Settings</h2>
          <div className="setting-button-group">
            <button className="setting-button" onClick={() => setSelectedOption("Report Bug")}>
              <AlertTriangle size={18} /> Report Bug
            </button>
            <button className="setting-button" onClick={() => setSelectedOption("FAQ")}>
              <HelpCircle size={18} /> FAQ
            </button>
            <button className="setting-button" onClick={() => setSelectedOption("Contact Us")}>
              <Mail size={18} /> Contact Us
            </button>
            <button className="setting-button" onClick={() => setSelectedOption("Privacy Policy")}>
              <Shield size={18} /> Privacy Policy
            </button>
            <button className="setting-button setting-delete" onClick={handleDeleteAccount}>
              <Trash2 size={18} /> Delete Account
            </button>
          </div>
        </div>
      </div>

      <div className="setting-content-area">
        <div className="setting-card">
          <h2 className="setting-title">{selectedOption}</h2>
          <div className="setting-card-content">
            <p>{contentMap[selectedOption] || "Select an option to see details."}</p>
            {selectedOption === "Delete Account" && showConfirmation && (
              <div className="setting-confirmation-dialog">
                <p>Are you sure you want to delete your account?</p>
                <div className="setting-confirmation-buttons">
                  <button className="setting-button setting-confirm" onClick={() => handleConfirmation(true)}>
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