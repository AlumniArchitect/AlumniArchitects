import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/navbar/Referral.css";

const ReferralPage = () => {
  const [allReferrals, setAllReferrals] = useState([]);
  const [myReferrals, setMyReferrals] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [packageAmount, setPackageAmount] = useState("");
  const [hrContact, setHrContact] = useState("");
  const [location, setLocation] = useState("");
  const [editReferralId, setEditReferralId] = useState(null);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email"); // Get logged-in user's email
  const userSkills = ["React", "Node.js", "Java"]; // Replace with actual user skills from backend

  // Fetch all referrals
  const fetchAllReferrals = async () => {
    try {
      const response = await fetch("/api/referrals");
      const data = await response.json();
      setAllReferrals(data);
    } catch (error) {
      console.error("Error fetching referrals:", error);
    }
  };

  // Fetch my referrals
  const fetchMyReferrals = async () => {
    try {
      const response = await fetch(`/api/referrals?postedBy=${userEmail}`);
      const data = await response.json();
      setMyReferrals(data);
    } catch (error) {
      console.error("Error fetching my referrals:", error);
    }
  };

  useEffect(() => {
    fetchAllReferrals();
    fetchMyReferrals();
  }, [userEmail]);

  // Handle posting or updating a referral
  const handleSubmit = async (e) => {
    e.preventDefault();
    const referralData = {
      jobRole,
      skillsRequired: skillsRequired.split(",").map((skill) => skill.trim()),
      packageAmount,
      hrContact,
      location,
      postedBy: userEmail,
    };
    try {
      const url = editReferralId ? `/api/referrals/${editReferralId}` : "/api/referrals";
      const method = editReferralId ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(referralData),
      });
      if (response.ok) {
        fetchAllReferrals();
        fetchMyReferrals();
        setShowPostForm(false); // Hide the form after submission
        setJobRole("");
        setSkillsRequired("");
        setPackageAmount("");
        setHrContact("");
        setLocation("");
        setEditReferralId(null);
      }
    } catch (error) {
      console.error("Error submitting referral:", error);
    }
  };

  // Handle editing a referral
  const handleEdit = (referral) => {
    setJobRole(referral.jobRole);
    setSkillsRequired(referral.skillsRequired.join(", "));
    setPackageAmount(referral.packageAmount);
    setHrContact(referral.hrContact);
    setLocation(referral.location);
    setEditReferralId(referral._id);
    setShowPostForm(true);
  };

  // Handle deleting a referral
  const handleDelete = async (referralId) => {
    try {
      const response = await fetch(`/api/referrals/${referralId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchAllReferrals();
        fetchMyReferrals();
      }
    } catch (error) {
      console.error("Error deleting referral:", error);
    }
  };

  // Filter referrals based on user skills
  const filteredReferrals = allReferrals.filter((referral) =>
    referral.skillsRequired.some((skill) => userSkills.includes(skill))
  );

  return (
    <div className="referral-page">
      <h1>Referral Page</h1>

      {/* Tabs */}
      <div className="tabs">
        <button
          onClick={() => setShowPostForm(false)}
          className={!showPostForm ? "active-tab" : ""}
        >
          All Referrals
        </button>
        <button
          onClick={() => setShowPostForm(false)}
          className={!showPostForm ? "active-tab" : ""}
        >
          My Referrals
        </button>
        <button
          onClick={() => setShowPostForm(true)}
          className={showPostForm ? "active-tab" : ""}
        >
          Post a Referral
        </button>
      </div>

      {/* Post Referral Form */}
      {showPostForm && (
        <div className="post-referral-form">
          <h2>{editReferralId ? "Edit Referral" : "Post a Referral"}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Job Role"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Skills Required (comma-separated)"
              value={skillsRequired}
              onChange={(e) => setSkillsRequired(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Package"
              value={packageAmount}
              onChange={(e) => setPackageAmount(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="HR Contact"
              value={hrContact}
              onChange={(e) => setHrContact(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <button type="submit">{editReferralId ? "Update Referral" : "Post Referral"}</button>
            <button type="button" onClick={() => setShowPostForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* All Referrals */}
      {!showPostForm && (
        <div className="referral-list">
          <h2>All Referrals</h2>
          {filteredReferrals.length > 0 ? (
            filteredReferrals.map((referral) => (
              <div key={referral._id} className="referral-card">
                <h3>{referral.jobRole}</h3>
                <p>
                  <strong>Skills Required:</strong>{" "}
                  {referral.skillsRequired.map((skill, index) => (
                    <span
                      key={index}
                      className={`skill-badge ${userSkills.includes(skill) ? "matched-skill" : ""}`}
                    >
                      {skill}
                    </span>
                  ))}
                </p>
                <p>
                  <strong>Package:</strong> {referral.packageAmount}
                </p>
                <p>
                  <strong>HR Contact:</strong> {referral.hrContact}
                </p>
                <p>
                  <strong>Location:</strong> {referral.location}
                </p>
                <p>
                  <strong>Posted By:</strong> {referral.postedBy}
                </p>
              </div>
            ))
          ) : (
            <p>No referrals available.</p>
          )}
        </div>
      )}

      {/* My Referrals */}
      {!showPostForm && (
        <div className="referral-list">
          <h2>My Referrals</h2>
          {myReferrals.length > 0 ? (
            myReferrals.map((referral) => (
              <div key={referral._id} className="referral-card">
                <h3>{referral.jobRole}</h3>
                <p>
                  <strong>Skills Required:</strong>{" "}
                  {referral.skillsRequired.join(", ")}
                </p>
                <p>
                  <strong>Package:</strong> {referral.packageAmount}
                </p>
                <p>
                  <strong>HR Contact:</strong> {referral.hrContact}
                </p>
                <p>
                  <strong>Location:</strong> {referral.location}
                </p>
                <div className="actions">
                  <button onClick={() => handleEdit(referral)}>Edit</button>
                  <button onClick={() => handleDelete(referral._id)}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>You have not posted any referrals.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralPage;