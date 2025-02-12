import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import "../../style/navbar/EventPage.css";
import Constant from "../../utils/Constant.js";

export default function EventPage() {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
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
  });

  const jwt = localStorage.getItem("jwt");
  const userEmail = localStorage.getItem("email");
  const URL = `${Constant.BASE_URL}/api/events`;

  /** Fetches all events from the backend. */
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
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  /** Handles changes to the filter values. */
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  /** Filters events based on selected criteria. */
  const filterAndSortEvents = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(`${URL}/filter`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(filters),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error filtering events:", error);
    }
  };

  useEffect(() => {
    filterAndSortEvents();
  }, [filters]);

  /** Adds a new event or updates an existing one. */
  const handleAddOrUpdateEvent = async (e) => {
    e.preventDefault();

    try {
      const headers = {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      };

      if (editingEvent) {
        const response = await fetch(`${URL}/${editingEvent.id}`, {
          method: "PUT",
          headers: headers,
          body: JSON.stringify(newEvent),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        setEvents(
          events.map((event) => (event.id === editingEvent.id ? newEvent : event))
        );
      } else {
        const response = await fetch(`${URL}`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(newEvent),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        fetchEvents();
      }

      resetForm();
      fetchEvents();
    } catch (error) {
      console.error("Error adding/updating event:", error);
    }
  };

  /** Registers the current user for an event. */
  const handleRegister = async (eventId) => {
    try {
      setRegisteredEvents([...registeredEvents, eventId]);
      alert("Successfully registered for the event!");
    } catch (error) {
      console.error("Error registering for event:", error);
    }
  };

  /** Unregisters the current user from an event. */
  const handleUnregister = async (eventId) => {
    try {
      setRegisteredEvents(registeredEvents.filter((id) => id !== eventId));
      alert("Successfully unregistered from the event!");
    } catch (error) {
      console.error("Error unregistering for event:", error);
    }
  };

  /** Deletes an event. */
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

  /** Opens the edit form for an event. */
  const handleEditEvent = (event) => {
    setNewEvent(event);
    setEditingEvent(event);
    setShowForm(true);
    setView("manage");
  };

  /** Handles input changes for the new event form. */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  /** Handles image upload for the new event form. */
  const handleImageUpload = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const imgUrl = URL.createObjectURL(files[0]);
      setNewEvent({ ...newEvent, imgUrl });
    }
  };

  /** Resets the new event form to its initial state. */
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

  /** Checks if the current user is the creator of the event. */
  const isEventCreator = (event) => {
    return event.email === userEmail;
  };

  /** Checks if the current user is registered for the event. */
  const isRegistered = (eventId) => {
    return registeredEvents.includes(eventId);
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
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <img src={event.imgUrl} alt={event.name} className="event-image" />
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
                    style={{ maxWidth: "100px", marginTop: "10px" }}
                  />
                )}
              </div>

              <button type="submit">
                {editingEvent ? "Update Event" : "Create Event"}
              </button>
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}