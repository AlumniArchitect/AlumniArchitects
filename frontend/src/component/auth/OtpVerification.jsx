import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Constant from "../../utils/Constant";

export default function OtpVerification() {

  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

  const handleOnClick = async () => {
    const temp = "email=" + localStorage.getItem("email") + "&otp=" + otp;

    try {
      const URL = `${Constant.BASE_URL}/auth/verify-otp?` + temp;

      const res = await fetch(URL, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await res.json();

      if (result.status) {

        localStorage.setItem("jwt", result.jwt);

        setTimeout(() => {
          navigate('/signin');
        }, 500);

      } else {
        alert("Error occurred");
      }

    } catch (e) {
      alert(e);
      console.error(e);
    }
  }

  return (
    <>
      <div id="verify-otp" className="form-group">
        <input
          type="text"
          name="Otp"
          id="Otp"
          placeholder='Enter Otp'
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button onClick={handleOnClick}>Verify Otp</button>
      </div>
    </>
  );
}