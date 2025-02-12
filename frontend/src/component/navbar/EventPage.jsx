import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import "../../style/navbar/EventPage.css";

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
    dateFrom: "",
    dateTo: "",
    sortBy: "date",
    sortOrder: "asc",
  });

  // Add current user state (this would come from auth in a real app)
  const [currentUser] = useState({
    id: 1,
    name: "Current User",
  });

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date(),
    location: "",
    description: "",
    type: "Technical",
    format: "Offline",
    link: "",
    image: "",
    maxParticipants: 0,
    registrationOpen: true,
  });

  // Load events from localStorage on component mount
  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
    const storedRegistrations = localStorage.getItem("registeredEvents");
    if (storedRegistrations) {
      setRegisteredEvents(JSON.parse(storedRegistrations));
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  // Save registrations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("registeredEvents", JSON.stringify(registeredEvents));
  }, [registeredEvents]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (sortBy) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder:
        prev.sortBy === sortBy
          ? prev.sortOrder === "asc"
            ? "desc"
            : "asc"
          : "asc",
    }));
  };

  const filterAndSortEvents = (events) => {
    return events
      .filter((event) => {
        const matchesSearch =
          event.title.toLowerCase().includes(search.toLowerCase()) ||
          event.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
          !filters.category || event.category === filters.category;
        const matchesType = !filters.type || event.type === filters.type;
        const matchesFormat =
          !filters.format || event.format === filters.format;
        const eventDate = new Date(event.date);
        const matchesDateFrom =
          !filters.dateFrom || eventDate >= new Date(filters.dateFrom);
        const matchesDateTo =
          !filters.dateTo || eventDate <= new Date(filters.dateTo);
        return (
          matchesSearch &&
          matchesCategory &&
          matchesType &&
          matchesFormat &&
          matchesDateFrom &&
          matchesDateTo
        );
      })
      .sort((a, b) => {
        if (filters.sortBy === "date") {
          const comparison = new Date(a.date) - new Date(b.date);
          return filters.sortOrder === "asc" ? comparison : -comparison;
        } else {
          const comparison = a.title.localeCompare(b.title);
          return filters.sortOrder === "asc" ? comparison : -comparison;
        }
      });
  };

  const handleAddOrUpdateEvent = (e) => {
    e.preventDefault();
    if (editingEvent) {
      setEvents(
        events.map((event) =>
          event.id === editingEvent.id
            ? { ...newEvent, id: editingEvent.id }
            : event
        )
      );
    } else {
      const newEventWithId = {
        ...newEvent,
        id: Date.now(),
        userId: currentUser.id,
        createdAt: new Date().toLocaleString(),
      };
      setEvents([...events, newEventWithId]);
    }
    resetForm();
  };

  const handleRegister = (eventId) => {
    if (
      !registeredEvents.some(
        (reg) => reg.eventId === eventId && reg.userId === currentUser.id
      )
    ) {
      const registration = {
        id: Date.now(),
        eventId,
        userId: currentUser.id,
        registeredAt: new Date().toLocaleString(),
      };
      setRegisteredEvents([...registeredEvents, registration]);
      alert("Successfully registered for the event!");
    } else {
      alert("You are already registered for this event.");
    }
  };

  const handleUnregister = (registrationId) => {
    setRegisteredEvents(
      registeredEvents.filter((reg) => reg.id !== registrationId)
    );
    alert("You have successfully unregistered from the event.");
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
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
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEvent({ ...newEvent, image: reader.result });
      };
      reader.readAsDataURL(file);
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
      image: "",
      maxParticipants: 0,
      registrationOpen: true,
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const filteredEvents = filterAndSortEvents(events);
  const upcomingEvents = filteredEvents.filter(
    (event) => new Date(event.date) >= new Date()
  );
  const pastEvents = filteredEvents.filter(
    (event) => new Date(event.date) < new Date()
  );

  const isEventCreator = (event) => {
    return event.userId === currentUser.id;
  };

  const isRegistered = (eventId) => {
    return registeredEvents.some(
      (reg) => reg.eventId === eventId && reg.userId === currentUser.id
    );
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
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Date To:</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            />
          </div>
        </div>

        <div className="sort-controls">
          <button
            className={`sort-button ${
              filters.sortBy === "date" ? "active" : ""
            }`}
            onClick={() => handleSortChange("date")}
          >
            Sort by Date{" "}
            {filters.sortBy === "date" &&
              (filters.sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            className={`sort-button ${
              filters.sortBy === "title" ? "active" : ""
            }`}
            onClick={() => handleSortChange("title")}
          >
            Sort by Title{" "}
            {filters.sortBy === "title" &&
              (filters.sortOrder === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>

      {view === "manage" && (
        <button className="create-button" onClick={() => setShowForm(true)}>
          Create New Event
        </button>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
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
                <label>Date & Time</label>
                <input
                  type="datetime-local"
                  name="date"
                  value={
                    newEvent.date
                      ? new Date(
                          newEvent.date.getTime() -
                            newEvent.date.getTimezoneOffset() * 60000
                        )
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    setNewEvent({
                      ...newEvent,
                      date: selectedDate ? new Date(selectedDate) : null,
                    });
                  }}
                  min={new Date(
                    new Date().getTime() -
                      new Date().getTimezoneOffset() * 60000
                  )
                    .toISOString()
                    .slice(0, 16)} // Restrict selection to future dates/times
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={newEvent.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>Type</label>
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
                <label>Format</label>
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

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <div>
          <h2>Upcoming Events</h2>
          <div className="events-grid">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="event-card">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="event-image"
                  />
                )}
                <h2>{event.title}</h2>
                <p className="event-location">📍 {event.location}</p>
                <p className="event-date">
                  📅 {new Date(event.date).toLocaleString()}
                </p>
                <p className="event-description">{event.description}</p>
                <p className="event-type">Type: {event.type}</p>
                <p className="event-format">Format: {event.format}</p>
                {event.format === "Online" && event.link && (
                  <p className="event-link">
                    🔗{" "}
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join Event
                    </a>
                  </p>
                )}
                <p className="event-time">
                  {formatDistanceToNow(new Date(event.date), {
                    addSuffix: true,
                  })}
                </p>
                <div className="event-actions">
                  {view === "manage" && isEventCreator(event) && (
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
                  {view === "all" && (
                    <>
                      {!isRegistered(event.id) ? (
                        <button
                          className="register-button"
                          onClick={() => handleRegister(event.id)}
                          disabled={!event.registrationOpen}
                        >
                          {event.registrationOpen
                            ? "Register Now"
                            : "Registration Closed"}
                        </button>
                      ) : (
                        <button
                          className="unregister-button"
                          onClick={() => {
                            const registrationId = registeredEvents.find(
                              (reg) =>
                                reg.eventId === event.id &&
                                reg.userId === currentUser.id
                            ).id;
                            handleUnregister(registrationId);
                          }}
                        >
                          Unregister
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missed Events Section */}
      {pastEvents.length > 0 && (
        <div>
          <h2>Missed Events</h2>
          <div className="events-grid">
            {pastEvents.map((event) => (
              <div key={event.id} className="event-card missed">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="event-image"
                  />
                )}
                <h2>{event.title}</h2>
                <p className="event-location">📍 {event.location}</p>
                <p className="event-date">
                  📅 {new Date(event.date).toLocaleString()}
                </p>
                <p className="event-description">{event.description}</p>
                <p className="event-type">Type: {event.type}</p>
                <p className="event-format">Format: {event.format}</p>
                {event.format === "Online" && event.link && (
                  <p className="event-link">
                    🔗{" "}
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Event
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Registered Events Section */}
      {registeredEvents.length > 0 && (
        <div className="registered-events">
          <h2>Your Registered Events</h2>
          {registeredEvents.map((registration) => {
            const event = events.find((e) => e.id === registration.eventId);
            if (!event) return null;
            return (
              <div key={registration.id} className="event-card registered">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="event-image"
                  />
                )}
                <h2>{event.title}</h2>
                <p className="event-location">📍 {event.location}</p>
                <p className="event-date">
                  📅 {new Date(event.date).toLocaleString()}
                </p>
                <p className="event-description">{event.description}</p>
                <p className="registration-info">
                  Registered on:{" "}
                  {new Date(registration.registeredAt).toLocaleDateString()}
                </p>
                <button
                  className="unregister-button"
                  onClick={() => handleUnregister(registration.id)}
                >
                  Unregister
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
