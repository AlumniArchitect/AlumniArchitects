import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/navbar/Referral.css";
import Constant from "../../utils/Constant";
import Navbar2 from "./Navbar2";

const ReferralPage = () => {
  const [allReferrals, setAllReferrals] = useState([]);
  const [myReferrals, setMyReferrals] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    skills: "",
    packages: "",
    HRContact: "",
    location: "",
  });
  const [editReferralId, setEditReferralId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");
  const jwtToken = localStorage.getItem("jwt");
  const [errors, setErrors] = useState({});

  // Fetch all referrals
  const fetchAllReferrals = async () => {
    try {
      const response = await fetch(`${Constant.BASE_URL}/api/referrals`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch all referrals");
      }

      const data = await response.json();
      setAllReferrals(data);
    } catch (error) {
      console.error("Error fetching all referrals:", error.message);
    }
  };

  // Fetch referrals by user email
  const fetchMyReferrals = async () => {
    try {
      const response = await fetch(
        `${Constant.BASE_URL}/api/referrals/email/${userEmail}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch my referrals");
      }

      const data = await response.json();
      setMyReferrals(data);
    } catch (error) {
      console.error("Error fetching my referrals:", error.message);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (!jwtToken) {
      navigate("/signin");
      return;
    }
    fetchAllReferrals();
    fetchMyReferrals();
  }, [jwtToken, navigate, userEmail]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { role, skills, packages, HRContact, location } = formData;
    let isValid = true;
    const newErrors = {};

    if (!role) {
      newErrors.role = "Job Role is required";
      isValid = false;
    }

    if (!packages) {
      newErrors.packages = "Package is required";
      isValid = false;
    }

    if (!HRContact) {
      newErrors.HRContact = "HR Contact is required";
      isValid = false;
    }

    if (!location) {
      newErrors.location = "Location is required";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      console.error("Please correct the errors in the form.");
      return;
    }

    let skillsArray = [];

    if (skills) {
      skillsArray = skills.split(/,\s*/).map((skill) => skill.trim());

      if (skillsArray.length > 5) {
        newErrors.skills = "You can enter maximum 5 skills";
        setErrors(newErrors);
        return;
      }
    }

    const referralData = {
      role,
      skills: skillsArray,
      packages,
      HRContact,
      location,
      email: userEmail,
    };

    try {
      let response;
      if (editReferralId) {
        // Update existing referral
        response = await fetch(
          `${Constant.BASE_URL}/api/referrals/${editReferralId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(referralData),
          }
        );
      } else {
        // Create new referral
        response = await fetch(`${Constant.BASE_URL}/api/referrals`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(referralData),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to submit referral");
      }

      const data = await response.json();

      // Update state
      if (editReferralId) {
        setAllReferrals((prevReferrals) =>
          prevReferrals.map((referral) =>
            referral.id === editReferralId ? data : referral
          )
        );
        setMyReferrals((prevReferrals) =>
          prevReferrals.map((referral) =>
            referral.id === editReferralId ? data : referral
          )
        );
      } else {
        setAllReferrals((prevReferrals) => [...prevReferrals, data]);
        setMyReferrals((prevReferrals) => [...prevReferrals, data]);
      }

      // Reset form
      setShowPostForm(false);
      setFormData({
        role: "",
        skills: "",
        packages: "",
        HRContact: "",
        location: "",
      });
      setEditReferralId(null);
      setActiveTab("all");
    } catch (error) {
      console.error("Error submitting referral:", error.message);
    }
  };

  // Handle edit referral
  const handleEdit = (referral) => {
    setFormData({
      role: referral.role,
      skills: referral.skills.join(", "),
      packages: referral.packages,
      HRContact: referral.HRContact,
      location: referral.location,
    });
    setEditReferralId(referral.id);
    setShowPostForm(true);
    setActiveTab("post");
  };
  // Handle delete referral
  const handleDelete = async (referralId) => {
    try {
      const response = await fetch(
        `${Constant.BASE_URL}/api/referrals/delete/${referralId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete referral");
      }

      // Update state
      setAllReferrals((prevReferrals) =>
        prevReferrals.filter((referral) => referral.id !== referralId)
      );
      setMyReferrals((prevReferrals) =>
        prevReferrals.filter((referral) => referral.id !== referralId)
      );
    } catch (error) {
      console.error("Error deleting referral:", error.message);
    }
  };

  return (
    <><Navbar2 />
    <div className="referral-page">
      <h1>Referral Page</h1>

      <div className="tabs">
        <button
          onClick={() => setActiveTab("all")}
          className={activeTab === "all" ? "active-tab" : ""}
        >
          All Referrals
        </button>
        <button
          onClick={() => setActiveTab("my")}
          className={activeTab === "my" ? "active-tab" : ""}
        >
          My Referrals
        </button>
        <button
          onClick={() => {
            setShowPostForm(true);
            setActiveTab("post");
          }}
          className={activeTab === "post" ? "active-tab" : ""}
        >
          Post a Referral
        </button>
      </div>
      {activeTab === "post" && (
        <div className="post-referral-form">
          <h2>{editReferralId ? "Edit Referral" : "Post a Referral"}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="role"
              placeholder="Job Role"
              value={formData.role}
              onChange={handleInputChange}
              required
            />
            {errors.role && <p className="error">{errors.role}</p>}
            <input
              type="text"
              name="skills"
              placeholder="Skills Required (comma-separated)"
              value={formData.skills}
              onChange={handleInputChange}
            />
            {errors.skills && <p className="error">{errors.skills}</p>}
            <input
              type="text"
              name="packages"
              placeholder="Package"
              value={formData.packages}
              onChange={handleInputChange}
              required
            />
            {errors.packages && <p className="error">{errors.packages}</p>}
            <input
              type="text"
              name="HRContact"
              placeholder="HR Contact"
              value={formData.HRContact}
              onChange={handleInputChange}
              required
            />
            {errors.HRContact && <p className="error">{errors.HRContact}</p>}
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
            {errors.location && <p className="error">{errors.location}</p>}
            <button type="submit">
              {editReferralId ? "Update Referral" : "Post Referral"}
            </button>
            <button type="button" onClick={() => setActiveTab("all")}>
              Cancel
            </button>
          </form>
        </div>
      )}
      {activeTab === "all" && (
        <div className="referral-list">
          <h2>All Referrals</h2>
          {allReferrals.length > 0 ? (
            allReferrals.map((referral) => (
              (referral.email !== userEmail
                ? <div key={referral.id} className="referral-card">
                  <h3>{referral.role}</h3>
                  <p>
                    <strong>Skills Required:</strong> {referral.skills.join(", ")}
                  </p>
                  <p>
                    <strong>Package:</strong> {referral.packages}
                  </p>
                  <p>
                    <strong>HR Contact:</strong> {referral.HRContact}
                  </p>
                  <p>
                    <strong>Location:</strong> {referral.location}
                  </p>
                  <p>
                    <strong>Posted By:</strong> {referral.email}
                  </p>
                </div>
                : null)
            ))
          ) : (
            <p>No referrals available.</p>
          )}
        </div>
      )}
      {activeTab === "my" && (
        <div className="referral-list">
          <h2>My Referrals</h2>
          {myReferrals.length > 0 ? (
            myReferrals.map((referral) => (
              <div key={referral.id} className="referral-card">
                <h3>{referral.role}</h3>
                <p>
                  <strong>Skills Required:</strong> {referral.skills.join(", ")}
                </p>
                <p>
                  <strong>Package:</strong> {referral.packages}
                </p>
                <p>
                  <strong>HR Contact:</strong> {referral.HRContact}
                </p>
                <p>
                  <strong>Location:</strong> {referral.location}
                </p>
                <div className="actions">
                  <button onClick={() => handleEdit(referral)}>Edit</button>
                  <button onClick={() => handleDelete(referral.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>You have not posted any referrals.</p>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default ReferralPage;
