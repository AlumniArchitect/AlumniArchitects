import "../../style/Admin/AdminPanel.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [homepageImages, setHomepageImages] = useState([]);
  const [moderators, setModerators] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  // Generic fetch function to avoid code duplication
  const fetchData = async (url, setter) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch data from ${url}`);
      const data = await response.json();
      setter(data);
    } catch (error) {
      console.error(`Error fetching data:`, error);
    }
  };

  useEffect(() => {
    fetchData("/api/homepage-images", setHomepageImages);
    fetchData("/api/moderators", setModerators);
    fetchData("/api/alumni", setAlumni);
    fetchData("/api/students", setStudents);
    fetchData("/api/events", setEvents);
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const newImage = await response.json();
      setHomepageImages((prevImages) => [...prevImages, newImage]);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <div className="sections">
        {/* Homepage Customization */}
        <div className="section">
          <h2>Homepage Images</h2>
          <input type="file" onChange={handleImageUpload} />
          <div className="image-grid">
            {homepageImages.map((image, index) => (
              <img key={index} src={image.url} alt={`Homepage Image ${index}`} />
            ))}
          </div>
        </div>

        {/* Moderator Management */}
        <div className="section">
          <h2>Moderators</h2>
          <button onClick={() => navigate("/add-moderator")}>
            Add Moderator
          </button>
          <div className="moderator-list">
            {moderators.map((moderator, index) => (
              <div key={index}>{moderator.name}</div>
            ))}
          </div>
        </div>

        {/* User Management */}
        <div className="section">
          <h2>Alumni</h2>
          <div className="user-list">
            {alumni.map((alumnus, index) => (
              <div key={index}>{alumnus.name}</div>
            ))}
          </div>
        </div>
        <div className="section">
          <h2>Students</h2>
          <div className="user-list">
            {students.map((student, index) => (
              <div key={index}>{student.name}</div>
            ))}
          </div>
        </div>

        {/* Event Management */}
        <div className="section">
          <h2>Events</h2>
          <button onClick={() => navigate("/create-event")}>Create Event</button>
          <div className="event-list">
            {events.map((event, index) => (
              <div key={index}>{event.name}</div>
            ))}
          </div>
        </div>

        {/* Payment Gateway */}
        <div className="section">
          <h2>Payment Gateway</h2>
          <button onClick={() => navigate("/payment-settings")}>
            Configure Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;