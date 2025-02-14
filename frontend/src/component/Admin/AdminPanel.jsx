import "../../style/Admin/AdminPanel.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImageSlider from "../HomePage/ImageSlider";
import Constant from "../../utils/Constant.js";
import Chart from "react-apexcharts";

const AdminPanel = () => {
  const [admin, setAdmin] = useState(null);
  const [homepageImages, setHomepageImages] = useState([]);
  const [moderators, setModerators] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await fetch(`${Constant.BASE_URL}/auth/admin/${email}`);
        if (!response.ok) throw new Error("Failed to fetch admin");
        const data = await response.json();
        if (!data) {
          navigate("/splash-screen");
        } else {
          setAdmin(data);
        }
      } catch (error) {
        console.error("Error fetching admin:", error);
        navigate("/splash-screen");
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchAdmin();
    } else {
      navigate("/splash-screen");
    }
  }, [email, navigate]);

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

  if (loading) return <div>Loading...</div>;
  if (!admin) return null;

  return (
    <div className="admin-panel">
      <nav className="navbar">
        <div className="navbar-title">Admin Panel</div>
        <div className="navbar-links">
          <button onClick={() => navigate("/event")}>Add Event</button>
          <button onClick={() => navigate("/view-students")}>
            View All Student Details
          </button>
          <button onClick={() => navigate("/view-alumni-requests")}>
            View Alumni Requests
          </button>
        </div>
      </nav>

      <section className="carousel-section">
        <h2>Featured Content</h2>
        <ImageSlider url={"https://picsum.photos/v2/list"} page={"1"} limit={"10"} />
      </section>
    </div>
  );
};

export default AdminPanel;