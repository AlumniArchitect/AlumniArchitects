import { useState, useEffect } from "react";
import Navbar from "./navbar/Navbar";
import { useNavigate } from "react-router-dom";
import ProfileCompletionMessage from "./HomePage/ProfileCompletion";
import Footer from "./footer/Footer";
import ImageSlider from "./HomePage/ImageSlider";

export default function Homepage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [event, setEvent] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  useEffect(() => {
    const fetchLatestEvent = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events/latest");

        if (!response.ok) {
          throw new Error("Failed to fetch event data");
        }

        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchLatestEvent();
  }, []);

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

  return (
    <>
      {error && <div className="error-message">{error}</div>}
      <div id="homepage">
        <Navbar />
        <ProfileCompletionMessage />
        <div className="event-show">
          <ImageSlider
            url={"https://picsum.photos/v2/list"}
            page={"1"}
            limit={"10"}
          />
          <div className="event-title">
            <h1>{event.name}</h1>
            <p>{event.description}</p>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
