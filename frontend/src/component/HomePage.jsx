import React, { useState, useEffect } from "react";
import Navbar from "./navbar/Navbar";
import { useNavigate } from "react-router-dom";
import ProfileCompletionMessage from "./HomePage/ProfileCompletion";
import Footer from "./footer/Footer";
import ImageSlider from "./HomePage/ImageSlider";
import Constant from "../utils/Constant";
import { formatDistanceToNow } from "date-fns";
import "../style/HomePage.css";

const Homepage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (localStorage.getItem("jwt") == null) {
      setError("Signin required.");
      showError(error);
      setError("");
      navigate("/signin");
    }
  }, [navigate, error]);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  const fetchEvents = async () => {
    try {
      const jwt = localStorage.getItem("jwt");
      const response = await fetch(`${Constant.BASE_URL}/api/events`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      // Filter out past events and sort by date (earliest date first)
      const currentDate = new Date();
      const upcomingEvents = data
        .filter((event) => new Date(event.date) >= currentDate)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setEvents(upcomingEvents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
      showError("Failed to load events.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src =
      "https://files.bpcontent.cloud/2025/02/07/00/20250207005523-NBGRZXQR.js";
    script2.async = true;
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  // Carousel Logic
  const handlePrevious = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? events.length - 1 : prevSlide - 1
    );
  };

  const handleNext = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === events.length - 1 ? 0 : prevSlide + 1
    );
  };

  useEffect(() => {
    if (!isPaused && events.length > 0) {
      const intervalId = setInterval(() => {
        handleNext();
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(intervalId);
    }
  }, [isPaused, events]);

  const displayedEvents = events.slice(0, 5);

  return (
    <>
      {error && <div className="homepage--error-message">{error}</div>}
      <div id="homepage">
        <Navbar />
        <ProfileCompletionMessage />


        <ImageSlider url={`${Constant.BASE_URL}/admin/get-portal-img/${email}`} />

        {/* Events Carousel Section */}
        <section className="homepage--events-carousel-section">
          <div className="homepage--events-header">
            <h2>Upcoming Events</h2>
            <button
              className="homepage--view-all-events"
              onClick={() => navigate("/event")}
            >
              View More
            </button>
          </div>
          {loading ? (
            <div>Loading events...</div>
          ) : events.length > 0 ? (
            <div
              className="homepage--events-carousel"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >

              {displayedEvents.map((event, index) => (
                <div
                  key={event.id}
                  className={`homepage--event-card ${
                    currentSlide === index ? "homepage--current-event" : "homepage--hide-event"
                  }`}
                >
                  {event.imgUrl && (
                    <div className="homepage--event-image-container">
                      <img
                        src={event.imgUrl}
                        alt={event.name}
                        className="homepage--event-image"
                      />
                    </div>
                  )}
                  <div className="homepage--event-details">
                    <h3>{event.name}</h3>
                    <p className="homepage--event-date">
                      {new Date(event.date).toLocaleDateString()} (
                      {formatDistanceToNow(new Date(event.date), {
                        addSuffix: true,
                      })}
                      )
                    </p>
                    <p className="homepage--event-location">Location: {event.location}</p>
                    <p className="homepage--event-description">
                      {event.description.substring(0, 100)}...
                    </p>{" "}
                    {/* Display a snippet */}
                    <button
                      className="homepage--event-view-more"
                      onClick={() => navigate("/event")} // Navigate to full event details page
                    >
                      View More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>No upcoming events.</div>
          )}
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Homepage;
