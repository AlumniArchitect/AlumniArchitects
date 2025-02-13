import { useState, useEffect } from "react";
import Navbar from "./navbar/Navbar";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

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

  // useEffect(() => {
  //     const script1 = document.createElement("script");
  //     script1.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
  //     script1.async = true;
  //     document.body.appendChild(script1);

  //     const script2 = document.createElement("script");
  //     script2.src = "https://files.bpcontent.cloud/2025/02/07/00/20250207005523-NBGRZXQR.js";
  //     script2.async = true;
  //     document.body.appendChild(script2);

  //     return () => {
  //         document.body.removeChild(script1);
  //         document.body.removeChild(script2);
  //     };
  // }, []);

  return (
    <>
      {error && <div className="error-message">{error}</div>}
      <div id="homepage">
        <Navbar />
        <EventPage />
      </div>
    </>
  );
}