import React, { useState } from "react";
import "../../style/navbar/EventPage.css";

const EventsPage = () => {
  const [events, setEvents] = useState([
    { title: "Hackathon", date: "2025-02-11", description: "24-hour coding competition." },
  ]);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", description: "" });

  const addEvent = () => {
    if (newEvent.title && newEvent.date) {
      setEvents([...events, newEvent]);
      setNewEvent({ title: "", date: "", description: "" });
    } else {
      alert("Please enter event title and date.");
    }
  };

  return (
    <div className="events-container">
      <h2>Upcoming Events</h2>
      <ul className="events-list">
        {events.map((event, index) => (
          <li key={index} className="event-item">
            <h3>{event.title}</h3>
            <p>{event.date}</p>
            <p>{event.description}</p>
          </li>
        ))}
      </ul>

      <div className="add-event">
        <h3>Add New Event</h3>
        <input
          type="text"
          placeholder="Event Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <input
          type="date"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
        />
        <textarea
          placeholder="Event Description"
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
        />
        <button onClick={addEvent}>Add Event</button>
      </div>
    </div>
  );
};

export default EventsPage;
