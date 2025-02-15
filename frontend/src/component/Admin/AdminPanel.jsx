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
          <button onClick={() => navigate("/view-alumni-requests")}>
            View Alumni Requests
          </button>
        </div>
      </nav>

      {/* Carousel Section */}
      <section className="carousel-section">
        <h2>Featured Content</h2>
        <ImageSlider url={"https://picsum.photos/v2/list"} page={"1"} limit={"10"} />
      </section>

      {/* Statistics Section */}
      <section className="statistics-section">
        <div className="histogram-container">
          <h3>Yearly Growth</h3>
          <Chart options={histogramOptions} series={histogramSeries} type="bar" height={400} />
        </div>

        <div className="pie-chart-container">
          <h3>Total Students vs Alumni</h3>
          <Chart options={pieChartOptions} series={pieChartSeries} type="donut" height={400} />
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;