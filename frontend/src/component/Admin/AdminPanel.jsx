import "../../style/Admin/AdminPanel.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImageSlider from "../HomePage/ImageSlider";
import Chart from "react-apexcharts";

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

  // Mock data for charts
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
       type: 'bar',
       height: '400',
     },
     xaxis: {
       categories: studentData.map(data => data.year),
     },
     plotOptions: {
       bar: {
         horizontal: false,
         endingShape: 'rounded',
         columnWidth: '70%',
       }
     },
     dataLabels: {
       enabled: true,
     }
   };

   // Series data for Histogram
   const histogramSeries = [{
     name: 'Students',
     data: studentData.map(data => data.count),
   },
   {
     name: 'Alumni',
     data: alumniData.map(data => data.count),
   }];

   // Series data for Pie Chart
   const pieChartSeries = [totalStudents, totalAlumni];

   // Chart options for Pie Chart
   const pieChartOptions = {
       chart: {
           type: 'donut',
       },
       labels: ['Students', 'Alumni'],
       dataLabels: {
           enabled: true,
           formatter: (val, opts) => {
               return opts.w.globals.series[opts.seriesIndex]; // Show absolute numbers
           }
       },
       plotOptions: {
           pie: {
               donut: {
                   size: '60%', // Adjust size as needed
               }
           }
       },
   };

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
         <ImageSlider url={"https://picsum.photos/v2/list"} page={'1'} limit={"10"} />
       </section>

       {/* Statistics Section */}
       <section className="statistics-section">
         <div className="histogram-container">
           <h3>Yearly Growth</h3>
           <Chart options={histogramOptions} series={histogramSeries} type="bar" height={400} />
         </div>

         <div className="piechart-container">
           <h3>Total Users</h3>
           <Chart options={pieChartOptions} series={pieChartSeries} type="donut" height={350} />
           <div className="piechart-legend">
             <div>
               <span className="legend-dot" style={{ backgroundColor: "#007bff" }}></span>
               Students: {totalStudents}
             </div>
             <div>
               <span className="legend-dot" style={{ backgroundColor: "#28a745" }}></span>
               Alumni: {totalAlumni}
             </div>
           </div>
         </div>
       </section>
     </div>
   );
};

export default AdminPanel;
