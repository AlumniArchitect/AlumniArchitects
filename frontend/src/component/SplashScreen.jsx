import "../style/SplashScreen.css";
import Footer from "./footer/Footer";
import img1 from "../assets/img1.jpg";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import Constant from "../utils/Constant";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [collegeEmail, setCollegeEmail] = useState("");
  const [password, setPassword] = useState("");
  const formRef = useRef(null); 

  const handleNavigate = (signin) => {
    if (signin) {
      navigate("/signin");
    } else {
      navigate("/signup");
    }
  };

  const handleRegisterCollege = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const URL = Constant.BASE_URL;

    try {
      const res = await fetch(`${URL}/auth/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: collegeEmail,
          password: password
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const data = await res.json();
      
      if (data) {
        localStorage.setItem("email", collegeEmail);
        navigate("/verify-otp", { state: { type: "admin" } });
      } else {
        console.error("Something went wrong");
      }

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div id="splash-screen" className="main-wrapper">
        <div className="splash-header">
          <div className="title">
            <h1>
              <i>Alumni Architect</i>
            </h1>
          </div>
          <div className="header-buttons">
            <button className="loginBtn" onClick={() => handleNavigate(true)}>
              <b>
                <i>Sign in</i>
              </b>
            </button>
            <button className="loginBtn" onClick={() => handleNavigate(false)}>
              <b>
                <i>Sign up</i>
              </b>
            </button>
            <button
              className="register-college-btn"
              onClick={handleRegisterCollege}
            >
              <b>Register Your College</b>
            </button>
          </div>
        </div>

        <div className="container-1">
          <div>
            <img src={img1} alt="image1" className="image-1" />
          </div>
          <div className="description">
            <div className="description-heading">
              <h1>Description</h1>
            </div>
            <p className="description-content">
              <i>
                Our platform connects alumni and students from technical
                education institutions. It aims to create a community and
                network where graduates and current students can work together,
                get advice, and share opportunities. Using advanced technology,
                the platform offers a central place to solve key issues like
                scattered systems, unstructured interactions, and limited
                engagement. It provides organized career guidance, builds a
                strong support network, and ensures user authenticity to avoid
                fake profiles and fraud.
              </i>
            </p>
          </div>
        </div>

        <div className="container-2">
          <div className="features">
            <div className="features-heading">
              <h1>Features of our Project</h1>
            </div>
            <div className="features-list">
              <ul>
                <li>Resource Library: Centralized access to learning materials.</li>
                <li>Group Study Rooms: Virtual collaboration spaces for assignments and resource sharing.</li>
                <li>Real-World Projects: Collaboration with alumni or industry partners for practical experience.</li>
                <li>Skill Progress Tracker: Monitors skill development and provides continuous feedback.</li>
                <li>Alumni Meetups: Events for direct engagement and networking.</li>
                <li>Discussion Forums: Platform for peer and mentor interactions.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="impacts">
          <h1 className="impacts-heading">Impact and Benefits</h1>
          <div className="impacts-content">
            <div className="students">
              <h3 className="students-heading">Students</h3>
              <ol>
                <li>Enhanced learning</li>
                <li>Career Guidance and Inspiration</li>
                <li>Networking opportunities</li>
                <li>Professional Connection</li>
              </ol>
            </div>
            <div className="alumini">
              <h3 className="alumini-heading">Alumni</h3>
              <ol>
                <li>Institutional Engagement</li>
                <li>Mentorship opportunities</li>
                <li>Collaborations</li>
              </ol>
            </div>
            <div className="institutions">
              <h3 className="institutions-heading">Institutions</h3>
              <ol>
                <li>Strengthened Alumni Relations</li>
                <li>Career Services</li>
                <li>Scholarships and collaborations</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="register-college-form-container" ref={formRef}>
          <form className="register-college-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="collegeEmail">College Email</label>
              <input
                type="email"
                id="collegeEmail"
                value={collegeEmail}
                onChange={(e) => setCollegeEmail(e.target.value)}
                required
              />
              <label htmlFor="collegePassword">Password</label>
              <input
                type="password"
                id="collegePassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="footer">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default SplashScreen;