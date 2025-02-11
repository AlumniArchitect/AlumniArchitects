import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow, format, parseISO } from "date-fns";
import "../../style/navbar/EventPage.css";

const eventsData = [];

export default function UpcomingEvents() {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState(eventsData);
  const [filteredEvents, setFilteredEvents] = useState(eventsData);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date(),
    location: "",
    description: "",
    type: "Technical",
    format: "Offline",
    link: "",
    image: null, // Store the image file here
  });
  const [imagePreview, setImagePreview] = useState(null); // Store the image URL for preview
  const modalRef = useRef(null);

  // Calculate the minimum date (tomorrow)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  useEffect(() => {
    const filtered = [...events]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .filter((event) =>
        event.title.toLowerCase().includes(search.toLowerCase())
      );
    setFilteredEvents(filtered);
  }, [search, events]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowForm(false);
        setEditingEvent(null);
        setImagePreview(null); // Clear the preview when the form is closed
      }
    };

    if (showForm) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showForm]);

  const handleAddOrUpdateEvent = (e) => {
    e.preventDefault();

    if (!newEvent.title || !newEvent.date || !newEvent.location || !newEvent.description) {
      alert("Please fill in all required fields.");
      return;
    }

    if (new Date(newEvent.date) < minDate) {
      alert("Event date must be from tomorrow onwards.");
      return;
    }

    //Convert newEvent.image (File object) to base64 string
    const fileToBase64 = (file) => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          resolve(reader.result);
        };
      });
    };

    const addEvent = async () => {
      const base64Image = newEvent.image ? await fileToBase64(newEvent.image) : null;
      if (editingEvent) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === editingEvent.id ? { ...newEvent, id: editingEvent.id, image: base64Image } : event
          )
        );
      } else {
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            ...newEvent,
            id: prevEvents.length > 0 ? Math.max(...prevEvents.map(e => e.id)) + 1 : 1,
            date: newEvent.date,
            image: base64Image, // Store as base64 string
          },
        ]);
      }
    };

    addEvent();
    resetForm();
  };

  const handleEditEvent = (event) => {
    setNewEvent({
      ...event,
      date: parseISO(event.date), // Ensure date is a Date object
    });
    setEditingEvent(event);
    setShowForm(true);
    // setImagePreview(event.image || null); // Set the image preview for editing
  };

  const handleDeleteEvent = (eventId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (confirmDelete) {
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  };

  const handleDateChange = (e) => {
    setNewEvent((prevEvent) => ({ ...prevEvent, date: new Date(e.target.value) }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // const imageUrl = URL.createObjectURL(file);
      setNewEvent({ ...newEvent, image: file });
    }
  };

  const handleRegister = (event) => {
    if (!registeredEvents.find((e) => e.id === event.id)) {
      setRegisteredEvents((prevRegisteredEvents) => [...prevRegisteredEvents, event]);
      alert(`You have successfully registered for ${event.title}!`);
    } else {
      alert(`You are already registered for ${event.title}!`);
    }
  };

  const resetForm = () => {
    setNewEvent({
      title: "",
      date: new Date(),
      location: "",
      description: "",
      type: "Technical",
      format: "Offline",
      link: "",
      image: null,
    });
    setEditingEvent(null);
    setShowForm(false);
    setImagePreview(null);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Upcoming Events</h1>
        <div className="button-group">
          <button onClick={() => setShowForm(true)}>New Event</button>
          <button onClick={() => (window.location.href = "/homepage")}>
            Home
          </button>
        </div>
      </div>
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      {showForm && (
        <div className="modal-overlay">
          <div className="modal" ref={modalRef}>
            <h2>{editingEvent ? "Edit Event" : "Create New Event"}</h2>
            <form onSubmit={handleAddOrUpdateEvent}>
              <div className="form-group">
                <label>Event Name</label>
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Event Date</label>
                <input
                  type="date"
                  name="date"
                  value={format(newEvent.date, "yyyy-MM-dd")}
                  onChange={handleDateChange}
                  min={format(minDate, "yyyy-MM-dd")}
                  required
                />
              </div>
              <div className="form-group">
                <label>Event Location</label>
                <input
                  type="text"
                  name="location"
                  value={newEvent.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Event Description</label>
                <textarea
                  className="textarea-field"
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Event Type</label>
                <select
                  name="type"
                  value={newEvent.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Technical">Technical</option>
                  <option value="Non-Technical">Non-Technical</option>
                </select>
              </div>
              <div className="form-group">
                <label>Event Format</label>
                <select
                  name="format"
                  value={newEvent.format}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Offline">Offline</option>
                  <option value="Online">Online</option>
                </select>
              </div>
              {newEvent.format === "Online" && (
                <div className="form-group">
                  <label>Event Link</label>
                  <input
                    type="url"
                    name="link"
                    value={newEvent.link}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}
              <div className="form-group">
                <label>Event Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit">
                  {editingEvent ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filteredEvents.length === 0 ? (
        <p className="no-events-message">No Upcoming Events.</p>
      ) : (
        filteredEvents.map((event) => (
          <div key={event.id} className="event-card">
            {event.image && (
              <img
                src={event.image}
                alt={event.title}
                className="event-image"
              />
            )}
            <h2>{event.title}</h2>
            <p>📍 {event.location}</p>
            <p>📅 {format(new Date(event.date), "MMMM dd, yyyy")}</p>
            <p>{event.description}</p>
            <p>Type: {event.type}</p>
            <p>Format: {event.format}</p>
            {event.format === "Online" && (
              <p>
                🔗{" "}
                <a href={event.link} target="_blank" rel="noopener noreferrer">
                  Event Link
                </a>
              </p>
            )}
            <div className="event-time">
              <span>
                {formatDistanceToNow(new Date(event.date), { addSuffix: true })}
              </span>
            </div>
            <button
              className="register-button"
              onClick={() => handleRegister(event)}
            >
              Register
            </button>
            <button
              className="edit-button"
              onClick={() => handleEditEvent(event)}
            >
              Edit
            </button>
            <button
              className="delete-button"
              onClick={() => handleDeleteEvent(event.id)}
            >
              Delete
            </button>
          </div>
        ))
      )}

      {registeredEvents.length > 0 && (
        <div className="registered-events">
          <h2>Registered Events</h2>
          {registeredEvents.map((event) => (
            <div key={event.id} className="event-card">
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="event-image"
                />
              )}
              <h2>{event.title}</h2>
              <p>📍 {event.location}</p>
              <p>📅 {format(new Date(event.date), "MMMM dd, yyyy")}</p>
              <p>{event.description}</p>
              <p>Type: {event.type}</p>
              <p>Format: {event.format}</p>
              {event.format === "Online" && (
                <p>
                  🔗{" "}
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Event Link
                  </a>
                </p>
              )}
              <div className="event-time">
                <span>
                  {formatDistanceToNow(new Date(event.date), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
