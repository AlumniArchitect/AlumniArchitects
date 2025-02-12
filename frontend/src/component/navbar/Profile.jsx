import React, { useState, useEffect } from "react";
import Constant from "../../utils/Constant";
import defaultProfileImage from "../../assets/userLogo.png";
import "../../style/navbar/Profile.css";

const EducationCard = ({ education }) => {
    return (
        <div className="education-card">
            <h4 className="education-type">{education.type}</h4>
            <p className="education-name">{education.name}</p>
            <p className="education-year">Year: {education.year}</p>
            <p className="education-cgpa">CGPA: {education.cgpa}</p>
        </div>
    );
};

const UserProfileSuggestion = ({ user }) => {
    return (
        <div className="user-profile-suggestion">
            <img
                src={user.profileImageUrl || defaultProfileImage}
                alt="profile"
                className="suggestion-profile-photo"
            />
            <p className="suggestion-name">{user.name}</p>
            <p className="suggestion-email">{user.email}</p>
            <div className="view-btn">
                <button
                    className="view-profile-btn"
                    onClick={() => {
                        // Add functionality to navigate to the user's profile page
                        alert(`Viewing profile of ${user.name}`);
                    }}
                >
                    View Profile
                </button>
            </div>
        </div>
    );
};

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userProfile, setUserProfile] = useState({
        name: "",
        profileImageUrl: defaultProfileImage,
    });
    const [user, setUser] = useState({
        email: localStorage.getItem("email") || null,
        mobileNumber: "+91",
        location: "",
        education: [],
        skills: [],
        resumeUrl: localStorage.getItem("resumeUrl") || null,
        profileImageUrl: localStorage.getItem("profileImageUrl") || defaultProfileImage,
        socialLinks: {
            github: "",
            linkedin: "",
            instagram: "",
        },
    });
    const [showPhotoOptions, setShowPhotoOptions] = useState(false);
    const [error, setError] = useState("");

    const [suggestedUsers, setSuggestedUsers] = useState([
        {
            name: "John Doe",
            email: "john.doe@example.com",
            profileImageUrl: "https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=",
        },
        {
            name: "Jane Smith",
            email: "jane.smith@example.com",
            profileImageUrl: "https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=",
        },
        {
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            profileImageUrl: "https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE="
        },
    ]);

    const jwt = localStorage.getItem("jwt");

    const handleEducationChange = (index, field, value) => {
        const updatedEducation = [...user.education];
        updatedEducation[index] = { ...updatedEducation[index], [field]: value };
        setUser({ ...user, education: updatedEducation });
    };

    const handleAddEducation = () => {
        setUser({
            ...user,
            education: [...user.education, { type: "", name: "", year: "", cgpa: "" }],
        });
    };

    const handleRemoveEducation = (index) => {
        const updatedEducation = user.education.filter((_, i) => i !== index);
        setUser({ ...user, education: updatedEducation });
    };

    useEffect(() => {
        const email = localStorage.getItem("email");
        const fetchUserProfile = async () => {
            try {
                const res = await fetch(`${Constant.BASE_URL}/api/userProfile/${user.email}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch user profile");
                const data = await res.json();
                if (data.status) {
                    setUser((prevUser) => ({ ...prevUser, ...data.userProfile }));
                } else {
                    showError(data.message);
                }
            } catch (err) {
                showError("Error: " + err.message);
            }
        };

        const fetchUserName = async () => {
            try {
                const res = await fetch(`${Constant.BASE_URL}/api/user/${email}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch user profile");
                const data = await res.json();
                if (data.status) {
                    setUserProfile((prev) => ({ ...prev, name: data.user.fullName }));
                } else {
                    showError("User name not found");
                }
            } catch (error) {
                showError("Error fetching user name: " + error.message);
            }
        };

        const fetchSuggestedUsers = async () => {
            try {
                const res = await fetch(`${Constant.BASE_URL}/api/userProfile/suggestions`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch suggested users");
                const data = await res.json();
                if (data.status) {
                    setSuggestedUsers(data.suggestedUsers);
                } else {
                    showError(data.message);
                }
            } catch (err) {
                showError("Error fetching suggested users: " + err.message);
            }
        };

        if (email && jwt) {
            fetchUserName();
            fetchUserProfile();
            fetchSuggestedUsers();
        }
    }, [user.email, jwt]);

    const showError = (message) => {
        setError(message);
        setTimeout(() => setError(""), 5000);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            showError("Please provide a file");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch(`${Constant.BASE_URL}/api/userProfile/uploadProfileImage/${user.email}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to upload image");
            }

            const data = await response.json();
            const imageUrl = data.imageUrl; // Assuming the server returns the image URL in a field named 'imageUrl'

            setUser(prevUser => ({ ...prevUser, profileImageUrl: imageUrl }));
            setUserProfile(prevProfile => ({ ...prevProfile, profileImageUrl: imageUrl })); // Update userProfile as well
            localStorage.setItem("profileImageUrl", imageUrl);
        } catch (error) {
            showError("Error uploading image: " + error.message);
        }
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`${Constant.BASE_URL}/api/userProfile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify(user),
            });
            const data = await res.json();
            if (data.status) {
                alert("Profile updated successfully!");
                setIsEditing(false);
            } else {
                showError(data.message);
            }
        } catch (err) {
            showError(err.message);
        }
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSocialLinkChange = (platform, value) => {
        setUser(prevUser => ({
            ...prevUser,
            socialLinks: {
                ...prevUser.socialLinks,
                [platform]: value
            }
        }));
    };

    return (
        <div className="profile-container">
            {/* Error */}
            {error && <div>{error}</div>}

            {/* Profile Sidebar */}
            <div className="profile-sidebar">
                {/* Profile Photo */}
                <div
                    className="profile-photo"
                    onClick={() => setShowPhotoOptions(true)}
                    style={{
                        backgroundImage: user.profileImageUrl ? `url('${user.profileImageUrl}')` : "none",
                    }}
                >
                    {!user.profileImageUrl && "+"}
                    <label className="photo-btn">
                        Change Photo
                        <input type="file" className="hidden-input" onChange={handleFileUpload} />
                    </label>
                </div>
                {/* User Name */}
                {isEditing ? (
                    <input
                        className="input-field"
                        value={userProfile.name}
                        placeholder="Full Name"  // Added placeholder
                        onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                    />
                ) : (
                    <div className="profile-name">{userProfile.name || "No name found"}</div>
                )}

                {/* Email */}
                <div className="profile-email">{user.email || "No email found"}</div>

                {/* Mobile */}
                {isEditing ? (
                    <input
                        className="input-field"
                        value={user.mobileNumber}
                        placeholder="+91-xxxxxxxxxx" // Added placeholder
                        onChange={(e) => setUser({ ...user, mobileNumber: e.target.value })}
                    />
                ) : (
                    <div className="profile-info">{user.mobileNumber}</div>
                )}

                {/* Resume */}
                {isEditing ? (
                    <input
                        className="input-field"
                        value={user.resumeUrl}
                        placeholder="Resume URL" // Added placeholder
                        onChange={(e) => setUser({ ...user, resumeUrl: e.target.value })}
                    />
                ) : (
                    <a href={user.resumeUrl} className="resume-info">
                        Resume
                    </a>
                )}

                {/* Save and Edit Button */}
                <button
                    className="edit-btn"
                    onClick={isEditing ? handleSave : toggleEdit}
                >
                    {isEditing ? "Save" : "Edit"}
                </button>
            </div>

            {/* Profile Main Content */}
            <div className="profile-main">
                {/* Education Section */}
                <div className="profile-section">
                    <h3 className="section-title">Education</h3>
                    {isEditing ? (
                        user.education?.map((edu, index) => (
                            <div key={index} className="education-edit">
                                <input
                                    className="input-field"
                                    value={edu.type}
                                    placeholder="Degree"
                                    onChange={(e) => handleEducationChange(index, "type", e.target.value)}
                                />
                                <input
                                    className="input-field"
                                    value={edu.name}
                                    placeholder="Institution Name"
                                    onChange={(e) => handleEducationChange(index, "name", e.target.value)}
                                />
                                <input
                                    className="input-field"
                                    value={edu.year}
                                    placeholder="Year"
                                    onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                                />
                                <input
                                    className="input-field"
                                    value={edu.cgpa}
                                    placeholder="CGPA"
                                    onChange={(e) => handleEducationChange(index, "cgpa", e.target.value)}
                                />
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemoveEducation(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))
                    ) : user.education?.length > 0 ? (
                        <div className="education-grid">
                            {user.education.map((edu, index) => (
                                <EducationCard key={index} education={edu} />
                            ))}
                        </div>
                    ) : (
                        <div>No Education added.</div>
                    )}
                    {isEditing && (
                        <button className="add-btn" onClick={handleAddEducation}>
                            Add Education
                        </button>
                    )}
                </div>

                {/* Skills Section */}
                <div className="profile-section">
                    <h3 className="section-title">Skills</h3>
                    {isEditing ? (
                        <input
                            className="input-field"
                            value={user.skills.join(",")}
                            placeholder="Skills (comma-separated)"
                            onChange={(e) =>
                                setUser({ ...user, skills: e.target.value.split(",").map((s) => s.trim().toUpperCase()) })
                            }
                        />
                    ) : user.skills?.length > 0 ? (
                        <div className="skills-container">
                            {user.skills.map((skill, index) => (
                                <div key={index} className="skill-badge">
                                    {skill.toUpperCase()}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>No Skills Found.</div>
                    )}
                </div>

                {/* Social Links Section */}
                <div className="profile-section">
                    <h3 className="section-title">Social Links</h3>
                    {isEditing ? (
                        <div>
                            <input
                                className="input-field"
                                placeholder="GitHub Link"
                                value={user.socialLinks.github || ""}
                                onChange={(e) => handleSocialLinkChange("github", e.target.value)}
                            />
                            <input
                                className="input-field"
                                placeholder="LinkedIn Link"
                                value={user.socialLinks.linkedin || ""}
                                onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                            />
                            <input
                                className="input-field"
                                placeholder="Instagram Link"
                                value={user.socialLinks.instagram || ""}
                                onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
                            />
                        </div>
                    ) : (
                        <ul className="social-links">
                            {user.socialLinks.github && (
                                <li>
                                    <a href={user.socialLinks.github}>GitHub</a>
                                </li>
                            )}
                            {user.socialLinks.linkedin && (
                                <li>
                                    <a href={user.socialLinks.linkedin}>LinkedIn</a>
                                </li>
                            )}
                            {user.socialLinks.instagram && (
                                <li>
                                    <a href={user.socialLinks.instagram}>Instagram</a>
                                </li>
                            )}
                        </ul>
                    )}
                </div>

                <div className="profile-section">
                    <h3 className="section-title">Suggested Profiles</h3>
                    <div className="suggested-users-container">
                        {suggestedUsers.length > 0 ? (
                            suggestedUsers.map((user, index) => (
                                <UserProfileSuggestion key={index} user={user} />
                            ))
                        ) : (
                            <p>No suggestions available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;