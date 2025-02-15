import { useEffect, useState } from "react";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import "../../style/HomePage/ImageSlider.css";
import Constant from "../../utils/Constant";

export default function ImageSlider({ url, limit = 5, page = 1 }) {
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const email = localStorage.getItem("email");

  // Fetch images from the API
  async function fetchImages(getUrl) {
    try {
      setLoading(true);

      const response = await fetch(`${Constant.BASE_URL}/admin/get-portal-img/${email}`);
      const data = await response.json();

      if (data) {
        setImages(data);
        setLoading(false);
      }
    } catch (e) {
      setErrorMsg(e.message);
      setLoading(false);
    }
  }

  // Handle previous slide
  function handlePrevious() {
    setCurrentSlide(currentSlide === 0 ? images.length - 1 : currentSlide - 1);
  }

  // Handle next slide
  function handleNext() {
    setCurrentSlide(currentSlide === images.length - 1 ? 0 : currentSlide + 1);
  }

  // Auto-play functionality
  useEffect(() => {
    if (images.length > 0 && !isPaused) {
      const interval = setInterval(() => {
        handleNext();
      }, 2000); 

      return () => clearInterval(interval);
    }
  }, [images, currentSlide, isPaused]);
  useEffect(() => {
    if (url !== "") fetchImages(url);
  }, [url]);

  if (loading) {
    return <div>Loading data! Please wait</div>;
  }

  if (errorMsg !== null) {
    return <div>Error occurred! {errorMsg}</div>;
  }

  return (
    <div 
      className="container"
      onMouseEnter={() => setIsPaused(true)}  // 🛑 Pause on hover
      onMouseLeave={() => setIsPaused(false)} // ▶ Resume on mouse leave
    >
      {/* Left Arrow */}
      <BsArrowLeftCircleFill
        onClick={handlePrevious}
        className="arrow arrow-left"
      />

      {/* Images */}
      {images && images.length
        ? images.map((imageItem, index) => (
            <img
              key={imageItem}
              alt={imageItem.download_url}
              src={imageItem}
              className={
                currentSlide === index
                  ? "current-image"
                  : "current-image hide-current-image"
              }
            />
          ))
        : null}

      {/* Right Arrow */}
      <BsArrowRightCircleFill
        onClick={handleNext}
        className="arrow arrow-right"
      />

      {/* Circle Indicators */}
      <span className="circle-indicators">
        {images && images.length
          ? images.map((_, index) => (
              <button
                key={index}
                className={
                  currentSlide === index
                    ? "current-indicator"
                    : "current-indicator inactive-indicator"
                }
                onClick={() => setCurrentSlide(index)}
              ></button>
            ))
          : null}
      </span>
    </div>
  );
}
