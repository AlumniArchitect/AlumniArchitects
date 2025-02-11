import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../style/navbar/EventPage.css";

const eventsData = [
  // Existing events data
      ];

export default function UpcomingEvents() {
  const [search, setSearch] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(eventsData);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date(),
    location: "",
    description: "",
    type: "Technical",
    format: "Offline", // Default format
    link: "", // Link for online events
    image: "",
  });
  const [events, setEvents] = useState(eventsData);
  const [showForm, setShowForm] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  useEffect(() => {
    setFilteredEvents(
      [...events]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .filter((event) =>
          event.title.toLowerCase().includes(search.toLowerCase())
        )
    );
  }, [search, events]);

  const handleAddEvent = (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page
    if (
      newEvent.title &&
      newEvent.date &&
      newEvent.location &&
      newEvent.description
    ) {
      setEvents([
        ...events,
        {
          ...newEvent,
          id: events.length + 1,
          date: newEvent.date.toISOString().split("T")[0],
        },
      ]);
      setNewEvent({
        title: "",
        date: new Date(),
        location: "",
        description: "",
        type: "Technical",
        format: "Offline",
        link: "",
        image: "",
      });
      setShowForm(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Generate a URL for the uploaded file
      setNewEvent({ ...newEvent, image: imageUrl });
    }
  };

  const handleRegister = (event) => {
    setRegisteredEvents([...registeredEvents, event]);
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
          <div className="modal">
            <h2>Create New Event</h2>
            <form onSubmit={handleAddEvent}>
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
                <DatePicker
                  selected={newEvent.date}
                  onChange={(date) => setNewEvent({ ...newEvent, date })}
                  dateFormat="yyyy-MM-dd"
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
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit">Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {filteredEvents.map((event) => (
        <div key={event.id} className="event-card">
          {event.image && (
            <img src={event.image} alt={event.title} className="event-image" />
          )}
          <h2>{event.title}</h2>
          <p>📍 {event.location}</p>
          <p>📅 {event.date}</p>
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
        </div>
      ))}
      {registeredEvents.length > 0 && (
        <div className="registered-events">
          <h2>Registered Events</h2>
          {registeredEvents.map((event) => (
            <div key={event.id} className="event-card">
              <h2>{event.title}</h2>
              <p>📍 {event.location}</p>
              <p>📅 {event.date}</p>
              <p>{event.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}