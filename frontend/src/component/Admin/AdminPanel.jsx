// AdminPanel.jsx
import "../../style/Admin/AdminPanel.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ImageSlider from "../HomePage/ImageSlider";
import Chart from "react-apexcharts";
import Constant from "../../utils/Constant.js";

const AdminPanel = () => {
  const [admin, setAdmin] = useState(null);
  const [homepageImages, setHomepageImages] = useState([]);
  const [moderators, setModerators] = useState([]);
  const [users, setUsers] = useState([]); // Combined list of students and alumni
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewStudents, setViewStudents] = useState(false);
  const [viewRequests, setViewRequests] = useState(false);
  const [showAddModeratorPopup, setShowAddModeratorPopup] = useState(false);
  const [moderatorEmail, setModeratorEmail] = useState("");
  const [alumni, setAlumni] = useState([]); // Initialize alumni state
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  // useRef hook to get a reference to the sections
  const studentsSectionRef = useRef(null);
  const alumniRequestsSectionRef = useRef(null);
  const addModeratorSectionRef = useRef(null);

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

  // Fetch user data (students and alumni)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${Constant.BASE_URL}/admin/get-user-data/${email}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUsers(data);

        // Separate alumni data
        const alumniData = data.filter((user) => user?.type === "ALUMNI");
        setAlumni(alumniData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (email) {
      fetchUserData();
    }
  }, [email]);

  // Fetch homepage images
  useEffect(() => {
    const fetchHomepageImages = async () => {
      try {
        const response = await fetch(`${Constant.BASE_URL}/admin/get-portal-img/${email}`);
        if (!response.ok) throw new Error("Failed to fetch homepage images");
        const data = await response.json();
        setHomepageImages(data);
      } catch (error) {
        console.error("Error fetching homepage images:", error);
      }
    };
    if (email) {
      fetchHomepageImages();
    }
  }, [email]);

  // Fetch moderators
  useEffect(() => {
    const fetchModerators = async () => {
      try {
        const response = await fetch(`${Constant.BASE_URL}/admin/${email}`);
        if (!response.ok) throw new Error("Failed to fetch moderators");
        const data = await response.json();
        setModerators(data);
      } catch (error) {
        console.error("Error fetching moderators:", error);
      }
    };
    if (email) {
      fetchModerators();
    }
  }, [email]);

  // Filter users into students and alumni
  const students = users.filter((user) => user?.type === "STUDENT");
  // const alumni = users.filter((user) => user?.type === "ALUMNI"); //Alumni is already set in fetchUserData

  // Count total students and alumni
  const totalStudents = students.length;
  const totalAlumni = alumni.length;

  // Dummy data for chart (replace with dynamic data if needed)
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

  // Handle accepting a request
  const handleAccept = async (requestId) => {
    try {
      const response = await fetch(
        `${Constant.BASE_URL}/admin/${email}/verified/${requestId}`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        setAlumni((prevAlumni) =>
          prevAlumni.filter((request) => request._id !== requestId)
        );
      } else {
        alert("Failed to accept request.");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // Handle rejecting a request
  const handleReject = async (requestId) => {
    try {
      const response = await fetch(
        `${Constant.BASE_URL}/admin/${email}/unverified-alumni/${requestId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setAlumni((prevAlumni) =>
          prevAlumni.filter((request) => request._id !== requestId)
        );
      } else {
        alert("Failed to reject request.");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  // Handle adding a moderator
  const handleAddModerator = async (e) => {
    e.preventDefault();

    // Validate email
    if (!moderatorEmail) {
      alert("Please enter a valid email address.");
      return;
    }

    // Check if the email is already a moderator
    const isAlreadyModerator = moderators.some(
      (mod) => mod.email.toLowerCase() === moderatorEmail.toLowerCase()
    );

    if (isAlreadyModerator) {
      alert("This email is already added as a moderator.");
      setModeratorEmail(""); // Clear the input field
      return;
    }

    try {
      const response = await fetch(`${Constant.BASE_URL}/admin/${email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ moderators: [...moderators, moderatorEmail] }),
      });

      if (response.ok) {
        const updatedModerators = [...moderators, moderatorEmail];
        setModerators(updatedModerators);
        setModeratorEmail(""); // Clear the input field
        alert("Moderator added successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add moderator.");
      }
    } catch (error) {
      console.error("Error adding moderator:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  // Handle removing a moderator
  const handleRemoveModerator = async (moderatorId) => {
    try {
      const response = await fetch(`${Constant.BASE_URL}/admin/${email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moderators: moderators.filter((mod) => mod !== moderatorId),
        }),
      });

      if (response.ok) {
        setModerators((prevModerators) =>
          prevModerators.filter((mod) => mod !== moderatorId)
        );
        alert("Moderator removed successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove moderator.");
      }
    } catch (error) {
      console.error("Error removing moderator:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  // Upload portal image
  const handleUploadPortalImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${Constant.BASE_URL}/admin/post-portal-img/${email}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        alert("Portal image uploaded successfully!");
        // Refresh images
        const refreshResponse = await fetch(
          `${Constant.BASE_URL}/admin/get-portal-img/${email}`
        );
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          setHomepageImages(data);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload portal image.");
      }
    } catch (error) {
      console.error("Error uploading portal image:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  // Function to handle scrolling to the section
  const scrollToSection = (sectionRef) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="admin-panel">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-title">Admin Panel</div>
        <div className="navbar-links">
          <button onClick={() => navigate("/event")}>Add Event</button>
          <button
            onClick={() => {
              setViewStudents(!viewStudents);
              if (!viewStudents && studentsSectionRef.current) {
                scrollToSection(studentsSectionRef);
              }
            }}
          >
            {viewStudents ? "Hide Student Details" : "View All Student Details"}
          </button>
          <button
            onClick={() => {
              setViewRequests(!viewRequests);
              if (!viewRequests && alumniRequestsSectionRef.current) {
                scrollToSection(alumniRequestsSectionRef);
              }
            }}
          >
            {viewRequests ? "Hide Alumni Requests" : "View Alumni Requests"}
          </button>
          <button
            onClick={() => {
              setShowAddModeratorPopup(true);
              if (addModeratorSectionRef.current) {
                scrollToSection(addModeratorSectionRef);
              }
            }}
          >
            Add Moderator
          </button>
        </div>
      </nav>

      {/* Carousel Section */}
      <section className="carousel-section">
        <h2>Featured Content</h2>
        <ImageSlider url={`${Constant.BASE_URL}/admin/get-portal-img/${email}`} />
        <input
          type="file"
          onChange={(e) => handleUploadPortalImage(e.target.files[0])}
          style={{ display: "none" }}
          id="upload-portal-image"
        />
        <button
          onClick={() => document.getElementById("upload-portal-image").click()}
        >
          Upload Portal Image
        </button>
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

      {/* View Students Section */}
      {viewStudents && (
        <section
          className="students-section"
          ref={studentsSectionRef}
          style={{ minHeight: "300px" }}
        >
          <h2>Student and Alumni Details</h2>

          {/* Students Table */}
          <div className="table-container">
            <h3>Students</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No students available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Alumni Table */}
          <div className="table-container">
            <h3>Alumni</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {alumni.length > 0 ? (
                  alumni.map((alumnus) => (
                    <tr key={alumnus._id}>
                      <td>{alumnus.name}</td>
                      <td>{alumnus.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No alumni available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* View Alumni Requests Section */}
      {viewRequests && (
        <section
          className="alumni-requests-section"
          ref={alumniRequestsSectionRef}
          style={{ minHeight: "300px" }}
        >
          <h2>Alumni Requests</h2>
          <div className="requests-container">
            {alumni.length > 0 ? (
              alumni.map((request) => (
                <div key={request._id} className="request-card">
                  <h3>{request.name}</h3>
                  <p>Email: {request.email}</p>
                  <p>Graduation Year: {request.graduationYear}</p>
                  <button onClick={() => navigate(`/profile/${request._id}`)}>
                    View Profile
                  </button>
                  <button onClick={() => handleAccept(request._id)}>
                    Accept
                  </button>
                  <button onClick={() => handleReject(request._id)}>
                    Reject
                  </button>
                </div>
              ))
            ) : (
              <p>No requests are pending.</p>
            )}
          </div>
        </section>
      )}

      {/* Add Moderator Popup */}
      {showAddModeratorPopup && (
        <div
          className="popup-overlay"
          ref={addModeratorSectionRef}
          style={{ minHeight: "300px" }}
        >
          <div className="popup-content request-card">
            <h2>Add Moderator</h2>
            <form onSubmit={handleAddModerator}>
              <input
                type="email"
                placeholder="Enter moderator's email"
                value={moderatorEmail}
                onChange={(e) => setModeratorEmail(e.target.value)}
                required
              />
              <button type="submit">Add Moderator</button>
              <button onClick={() => setShowAddModeratorPopup(false)}>
                Cancel
              </button>
            </form>
            {moderators.length > 0 && (
              <div className="moderator-list">
                <h3>Current Moderators</h3>
                <ul>
                  {moderators.map((moderator, index) => (
                    <li key={index}>
                      {moderator}
                      <button onClick={() => handleRemoveModerator(moderator)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
