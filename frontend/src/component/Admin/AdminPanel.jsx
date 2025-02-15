// AdminPanel.jsx
import "../../style/Admin/AdminPanel.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImageSlider from "../HomePage/ImageSlider";
import Chart from "react-apexcharts";
import Constant from "../../utils/Constant.js";

const AdminPanel = () => {
  const [admin, setAdmin] = useState(null);
  const [homepageImages, setHomepageImages] = useState([]);
  const [moderators, setModerators] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alumniRequests, setAlumniRequests] = useState([]); // New state for alumni requests
  const [showAlumniRequests, setShowAlumniRequests] = useState(false); // State to toggle visibility
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  // Dummy data for charts
  const studentData = [
    { year: 2018, count: 50 },
    { year: 2019, count: 70 },
    { year: 2020, count: 100 },
    { year: 2021, count: 120 },
    { year: 2022, count: 150 },
  ];
  const alumniData = [
    { year: 2018, count: 30 },
    { year: 2019, count: 40 },
    { year: 2020, count: 60 },
    { year: 2021, count: 80 },
    { year: 2022, count: 100 },
  ];
  const totalStudents = 100;
  const totalAlumni = 50;

  // Chart options for Histogram
  const histogramOptions = {
    chart: {
      type: "bar",
      height: "400",
    },
    xaxis: {
      categories: studentData.map((data) => data.year),
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: "rounded",
        columnWidth: "70%",
      },
    },
    dataLabels: {
      enabled: true,
    },
  };

  // Series data for Histogram
  const histogramSeries = [
    {
      name: "Students",
      data: studentData.map((data) => data.count),
    },
    {
      name: "Alumni",
      data: alumniData.map((data) => data.count),
    },
  ];

  // Series data for Pie Chart
  const pieChartSeries = [totalStudents, totalAlumni];

  // Chart options for Pie Chart
  const pieChartOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Students", "Alumni"],
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        return opts.w.globals.series[opts.seriesIndex]; // Show absolute numbers
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%", // Adjust size as needed
        },
      },
    },
  };

  // Fetch admin details
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await fetch(
          `${Constant.BASE_URL}/auth/admin/${email}`
        );
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

  // Generic function to fetch data
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

  // Fetch all required data on component mount
  useEffect(() => {
    fetchData("/api/homepage-images", setHomepageImages);
    fetchData("/api/moderators", setModerators);
    fetchData("/api/alumni", setAlumni);
    fetchData("/api/students", setStudents);
    fetchData("/api/events", setEvents);
  }, []);

  // Function to fetch alumni requests
  const fetchAlumniRequests = async () => {
    try {
      const response = await fetch("/api/alumni-requests"); // Replace with your actual API endpoint
      if (!response.ok) throw new Error("Failed to fetch alumni requests");
      const data = await response.json();
      setAlumniRequests(data);
    } catch (error) {
      console.error("Error fetching alumni requests:", error);
    }
  };

  // Handle view alumni requests button click
  const handleViewAlumniRequests = () => {
    fetchAlumniRequests();
    setShowAlumniRequests(true);
  };

  // Handle verify alumni request
  const handleVerifyAlumni = async (alumniId) => {
    try {
      // Make an API call to verify the alumni
      const response = await fetch(`/api/alumni/${alumniId}/verify`, {
        method: "PUT", // or PATCH, depending on your API
      });

      if (!response.ok) {
        throw new Error("Failed to verify alumni");
      }

      // Update the state to remove the verified alumni from the requests list
      setAlumniRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== alumniId)
      );
    } catch (error) {
      console.error("Error verifying alumni:", error);
    }
  };

  // Handle reject alumni request
  const handleRejectAlumni = async (alumniId) => {
    try {
      // Make an API call to reject the alumni
      const response = await fetch(`/api/alumni/${alumniId}/reject`, {
        method: "DELETE", // or PATCH, depending on your API
      });

      if (!response.ok) {
        throw new Error("Failed to reject alumni");
      }

      // Update the state to remove the rejected alumni from the requests list
      setAlumniRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== alumniId)
      );
    } catch (error) {
      console.error("Error rejecting alumni:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!admin) return null;

  return (
    <div className="admin-panel">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-title">Admin Panel</div>
        <div className="navbar-links">
          <button onClick={() => navigate("/event")}>Add Event</button>
          <button onClick={() => navigate("/view-students")}>
            View All Student Details
          </button>
          <button onClick={handleViewAlumniRequests}>
            View Alumni Requests
          </button>
        </div>
      </nav>

      {/* Carousel Section */}
      <section className="carousel-section">
        <h2>Featured Content</h2>
        <ImageSlider
          url={"https://picsum.photos/v2/list"}
          page={"1"}
          limit={"10"}
        />
      </section>

      {/* Statistics Section */}
      <section className="statistics-section">
        <div className="histogram-container">
          <h3>Yearly Growth</h3>
          <Chart
            options={histogramOptions}
            series={histogramSeries}
            type="bar"
            height={400}
          />
        </div>

        <div className="pie-chart-container">
          <h3>Total Students vs Alumni</h3>
          <Chart
            options={pieChartOptions}
            series={pieChartSeries}
            type="donut"
            height={400}
          />
        </div>
      </section>

      {/* Alumni Requests Section */}
      {showAlumniRequests && (
        <section className="alumni-requests-section">
          <h2>Alumni Requests</h2>
          <ul className="alumni-requests-list">
            {alumniRequests.map((request) => (
              <li key={request.id} className="alumni-request-item">
                <div className="alumni-details">
                  <p>
                    <strong>Name:</strong> {request.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {request.email}
                  </p>
                  {/* Add more details as needed */}
                </div>
                <div className="alumni-actions">
                  <button className="view-photo-button">View Photo</button>
                  <button
                    className="verify-button"
                    onClick={() => handleVerifyAlumni(request.id)}
                  >
                    Verify
                  </button>
                  <button
                    className="reject-button"
                    onClick={() => handleRejectAlumni(request.id)}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default AdminPanel;
