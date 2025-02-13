import { useEffect, useState, useRef } from "react";
import "../../style/navbar/UserSuggestion.css";
import Constant from "../../utils/Constant";
import defaultProfileImage from "../../assets/userLogo.png";
import { useNavigate } from "react-router-dom";

const UserSuggestion = ({ email }) => {
    const [profiles, setProfiles] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const jwt = localStorage.getItem("jwt");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfiles = async () => {
            if (loading) return;

            setLoading(true);
            try {
                const URL = `${Constant.BASE_URL}/api/suggest/user-profile/${email}/${page}`;
                const response = await fetch(URL, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                const data = await response.json();

                if (Array.isArray(data)) {
                    setProfiles((prevProfiles) => [...prevProfiles, ...data]);
                } else if (data.message) {
                    console.warn("No suggestions available:", data.message);
                } else {
                    console.error("Unexpected API response format:", data);
                }
            } catch (error) {
                console.error("Error fetching profiles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, [email, page]);

    const handleViewProfile = (email) => {
        navigate("/profile", {state: { email } });
    }


    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
        }
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            if (scrollLeft + clientWidth >= scrollWidth - 10 && !loading) {
                setPage((prevPage) => prevPage + 1);
            }
        }
    };

    return (
        <div className="user-suggestion-container">
            <div className="header">
                <button className="scroll-btn" onClick={scrollLeft}>
                    &#10094;
                </button>
                <h2>User Suggestions</h2>
                <button className="scroll-btn" onClick={scrollRight}>
                    &#10095;
                </button>
            </div>

            <div className="profile-list" ref={scrollRef} onScroll={handleScroll}>
                {profiles.map((profile) => (
                    <div className="profile-card" key={profile.email} onClick={() => handleViewProfile(profile.email)}>
                        <img
                            src={profile.profileImageUrl || { defaultProfileImage }}
                            alt="Profile"
                            className="profile-img"
                        />
                        <p className="profile-name">{profile.fullName || "Unknown"}</p>
                        <p className="profile-email">{profile.email}</p>
                    </div>
                ))}
            </div>

            {loading && <p className="loading-text">Loading more profiles...</p>}
        </div>
    );
};

export default UserSuggestion;