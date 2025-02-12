import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import "../../style/navbar/EventPage.css";
import Constant from "../../utils/Constant.js";
import { useNavigate } from 'react-router-dom';

export default function EventPage() {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showRegistered, setShowRegistered] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [view, setView] = useState("all");
  const [filters, setFilters] = useState({
    category: "",
    type: "",
    format: "",
    startDate: "",
    endDate: "",
  });

  const [newEvent, setNewEvent] = useState({
    email: localStorage.getItem("email") || "",
    name: "",
    date: new Date().toISOString().split("T")[0],
    location: "",
    description: "",
    type: "",
    category: "",
    format: "",
    imgUrl: "",
    registered: []
  });

  const [eventParticipants, setEventParticipants] = useState([]);
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const userEmail = localStorage.getItem("email");
  const URL = `${Constant.BASE_URL}/api/events`;

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${URL}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      data.forEach(event => {
        if (event.registered?.includes(userEmail)) {
          setRegisteredEvents(prev => [...prev, event.id]);
        }
      });

      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    let filtered = [...events];

    if (view === "manage") {
      filtered = filtered.filter((event) => event.email === userEmail);
    } else {
      filtered = filtered.filter((event) => event.email !== userEmail);
    }

    if (filters.category) {
      filtered = filtered.filter((event) => event.category === filters.category);
    }
    if (filters.type) {
      filtered = filtered.filter((event) => event.type === filters.type);
    }
    if (filters.format) {
      filtered = filtered.filter((event) => event.format === filters.format);
    }
    if (filters.startDate) {
      filtered = filtered.filter((event) => event.date >= filters.startDate);
    }
    if (filters.endDate) {
      filtered = filtered.filter((event) => event.date <= filters.endDate);
    }

    setFilteredEvents(filtered);
  }, [events, view, filters, userEmail]);

  const handleAddOrUpdateEvent = async (e) => {
    e.preventDefault();

    try {
      const headers = {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      };
      const response = await fetch(`${URL}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchEvents();

      resetForm();
      fetchEvents();
    } catch (error) {
      console.error("Error adding/updating event:", error);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const res = await fetch(`${URL}/registration/${eventId}?email=${userEmail}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });

      if (!res.ok) {
        throw new Error("something went wrong." + res.status);
      }

      setRegisteredEvents(prev => [...prev, eventId]);
    } catch (error) {
      console.error("Error registering for event:", error);
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      const res = await fetch(`${URL}/un-registration/${eventId}?email=${userEmail}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`
        }
      });

      if (!res.ok) {
        throw new Error("something went wrong." + res.status);
      }

      setRegisteredEvents(prev => prev.filter(id => id !== eventId));
    } catch (error) {
      console.error("Error un-registering for event:", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const headers = {
        Authorization: `Bearer ${jwt}`,
      };
      const response = await fetch(`${URL}/delete/${id}`, {
        method: "DELETE",
        headers: headers,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setEvents(events.filter((event) => event.id !== id));
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEditEvent = (event) => {
    setNewEvent(event);
    setEditingEvent(event);
    setShowForm(true);
    setView("manage");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleImageUpload = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const imgUrl = URL.createObjectURL(files[0]);
      setNewEvent({ ...newEvent, imgUrl });
    }
  };

  const resetForm = () => {
    setNewEvent({
      email: userEmail || "",
      name: "",
      date: new Date().toISOString().split("T")[0],
      location: "",
      description: "",
      type: "",
      category: "",
      format: "",
      imgUrl: "",
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const isEventCreator = (event) => {
    return event.email === userEmail;
  };

  const isRegistered = (eventId) => {
    return registeredEvents.includes(eventId);
  };

  const handleShowRegistered = (event) => {
    setEventParticipants(event.registered);
    setShowRegistered(true);
  };

  const handleCloseRegistered = () => {
    setShowRegistered(false);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Alumni Events</h1>
        <div className="view-controls">
          <button
            className={`view-button ${view === "all" ? "active" : ""}`}
            onClick={() => setView("all")}
          >
            All Events
          </button>
          <button
            className={`view-button ${view === "manage" ? "active" : ""}`}
            onClick={() => setView("manage")}
          >
            My Events
          </button>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
        />
      </div>

      <div className="filters-section">
        <div className="filter-controls">
          <div className="filter-group">
            <label>Category:</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Reunion">Reunion</option>
              <option value="Networking">Networking</option>
              <option value="Career Fair">Career Fair</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Type:</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Technical">Technical</option>
              <option value="Non-Technical">Non-Technical</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Format:</label>
            <select
              value={filters.format}
              onChange={(e) => handleFilterChange("format", e.target.value)}
            >
              <option value="">All Formats</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Date From:</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Date To:</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </div>
        </div>
      </div>

      {view === "manage" && (
        <button className="create-button" onClick={() => setShowForm(true)}>
          Create New Event
        </button>
      )}

      <div className="events-list">
        {filteredEvents.map((event) => (
          <div key={event.id} className="event-card">
            {event.imgUrl && (
              <img src={event.imgUrl} alt={event.name} className="event-image" />
            )}
            <div className="event-details">
              <h3>{event.name}</h3>
              <p className="event-date">
                {new Date(event.date).toLocaleDateString()} (
                {formatDistanceToNow(new Date(event.date), { addSuffix: true })}
                )
              </p>
              <p className="event-location">Location: {event.location}</p>
              <p className="event-description">{event.description}</p>
              <p className="event-type">Type: {event.type}</p>
              <p className="event-format">Format: {event.format}</p>
              <div className="event-actions">
                {!isEventCreator(event) ? (
                  isRegistered(event.id) ? (
                    <button
                      className="unregister-button"
                      onClick={() => handleUnregister(event.id)}
                    >
                      Unregister
                    </button>
                  ) : (
                    <button
                      className="register-button"
                      onClick={() => handleRegister(event.id)}
                    >
                      Register
                    </button>
                  )
                ) : (
                  <>
                    <button
                      className="edit-button"
                      onClick={() => handleEditEvent(event)}
                    >
                      Edit
                    </button>
                    <button
                      className="registered-button"
                      onClick={() => handleShowRegistered(event)}
                    >
                      Registered Emails
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingEvent ? "Edit Event" : "Create New Event"}</h2>
            <form onSubmit={handleAddOrUpdateEvent}>
              <div className="form-group">
                <label>Event Name</label>
                <input
                  type="text"
                  name="name"
                  value={newEvent.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Event Date</label>
                <input
                  type="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleInputChange}
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
                />
              </div>

              <div className="form-group">
                <label>Event Description</label>
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Event Type</label>
                <select
                  name="type"
                  value={newEvent.type}
                  onChange={handleInputChange}
                >
                  <option value="">Select Type</option>
                  <option value="Technical">Technical</option>
                  <option value="Non-Technical">Non-Technical</option>
                </select>
              </div>

              <div className="form-group">
                <label>Event Category</label>
                <select
                  name="category"
                  value={newEvent.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  <option value="Reunion">Reunion</option>
                  <option value="Networking">Networking</option>
                  <option value="Career Fair">Career Fair</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                </select>
              </div>

              <div className="form-group">
                <label>Event Format</label>
                <select
                  name="format"
                  value={newEvent.format}
                  onChange={handleInputChange}
                >
                  <option value="">Select Format</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {newEvent.imgUrl && (
                  <img
                    src={newEvent.imgUrl}
                    alt="Event Preview"
                    style={{ maxWidth: "200px" }}
                  />
                )}
              </div>

              <button type="submit" className="btn submit-button">
                {editingEvent ? "Update Event" : "Create Event"}
              </button>
              <button type="button" className="btn cancel-button" onClick={resetForm}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {showRegistered && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Registered Participants</h2>
              <button className="close-button" onClick={handleCloseRegistered}>
                close
              </button>
            </div>
            <div className="modal-body">
              {eventParticipants.length === 0 ? (
                <p>No participants registered for this event.</p>
              ) : (
                <ul className="registered-list">
                  {eventParticipants.map((email, index) => (
                    <li key={index} onClick={() => navigate('/profile', { state: { email } })} style={{cursor: 'pointer'}}>
                      {email}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}