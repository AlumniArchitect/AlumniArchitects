import "../style/SplashScreen.css";
import img1 from '../component/Assets/img1.jpg'

const SplashScreen = () => {
    return(
        <div className="main-wrapper">
            <div className="header">
                <div className="title"><i><h1>Alumini Architect</h1></i></div>
                <button className="loginBtn"><b><i>Login</i></b></button>
            </div>
            <div className="container-1">
                <div>
                            <img src={img1} alt="image1" className="image-1" />
                </div>
                <div className="description">
                    <p className="description-heading">
                        <h1>Description</h1>
                    </p>
                    <p className="description-content">
                        <i>Our platform connects alumni and students from technical education institutions. It aims to create a community and network where graduates and current students can work together, get advice, and share opportunities. Using advanced technology, the platform offers a central place to solve key issues like scattered systems, unstructured interactions, and limited engagement. It provides organized career guidance, builds a strong support network, and ensures user authenticity to avoid fake profiles and fraud.
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
                            <li> Resource Library: Centralized access to learning materials.</li>
                            <li>Group Study Rooms: Virtual collaboration spaces for assignments and resource sharing.</li>
                            <li>Real-World Projects: Collaboration with alumni or industry partners for practical experience.</li>
                            <li>Skill Progress Tracker: Monitors skill development and provides continuous feedback.</li>
                            <li>Alumni Meetups: Events for direct engagement and networking.</li>
                            <li> Discussion Forums: Platform for peer and mentor interactions.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="impacts">
                <h1 class="impacts-heading">Impact and Benefits</h1>
                <div class="impacts-content">
                    <div class="students">
                        <h3 class="students-heading">Students</h3>
                        <ol>
                            <li>1. Enhanced learning</li>
                            <li>2. Career Guidance and Inspiration</li>
                            <li>3. Networking opportunities</li>
                            <li>4. Professional Connection</li>
                        </ol>
                    </div>
                    <div class="alumini">
                        <h3 class="alumini-heading">Alumni</h3>
                        <ol>
                            <li>1. Institutional Engagement</li>
                            <li>2. Mentorship opportunities</li>
                            <li>3. Collaborations</li>
                        </ol>
                    </div>
                    <div class="institutions">
                        <h3 class="institutions-heading">Institutions</h3>
                        <ol>
                            <li>1. Strengthened Alumni Relations</li>
                            <li>2. Career Services</li>
                            <li>3. Scholarships and collaborations</li>
                        </ol>
                    </div>
            </div>
            </div>

        </div>
    )
}

export default SplashScreen;