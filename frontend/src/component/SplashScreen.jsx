import "../style/SplashScreen.css";
import img1 from '../assets/img1.jpg';
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
    const navigate = useNavigate();

    const handleNavigate = (signin) => {
        if (signin) {
            navigate("/signin");
        } else {
            navigate("/signup");
        }
    };

    return (
        <>
            <div id="splash-screen" className="main-wrapper">
                <div className="splash-header">
                    <div className="title">
                        <h1><i>Alumini Architect</i></h1>
                    </div>
                    <div>
                        <button className="loginBtn" onClick={() => handleNavigate(true)}>
                            <b><i>Sign in</i></b>
                        </button>
                        <button className="loginBtn" onClick={() => handleNavigate(false)}>
                            <b><i>Sign up</i></b>
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
                            <i>Our platform connects alumni and students from technical education institutions. It aims to create a community and network where graduates and current students can work together, get advice, and share opportunities. Using advanced technology, the platform offers a central place to solve key issues like scattered systems, unstructured interactions, and limited engagement. It provides organized career guidance, builds a strong support network, and ensures user authenticity to avoid fake profiles and fraud.</i>
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
                                <li>1. Enhanced learning</li>
                                <li>2. Career Guidance and Inspiration</li>
                                <li>3. Networking opportunities</li>
                                <li>4. Professional Connection</li>
                            </ol>
                        </div>
                        <div className="alumini">
                            <h3 className="alumini-heading">Alumni</h3>
                            <ol>
                                <li>1. Institutional Engagement</li>
                                <li>2. Mentorship opportunities</li>
                                <li>3. Collaborations</li>
                            </ol>
                        </div>
                        <div className="institutions">
                            <h3 className="institutions-heading">Institutions</h3>
                            <ol>
                                <li>1. Strengthened Alumni Relations</li>
                                <li>2. Career Services</li>
                                <li>3. Scholarships and collaborations</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SplashScreen;