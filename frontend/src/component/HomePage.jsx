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
    return (
        <>
            {error && <div className="error-message">{error}</div>}
            <div id="homepage">
                <Navbar />
            </div>
        </>
    );
}