import React, { useState } from 'react';
import "../../style/navbar/EventPage.css";

const EventsPage = () => {
  const [events, setEvents] = useState([
    { id: 1, name: 'Alumni Meetup', date: '2025-02-15', description: 'Reconnect with alumni and network.' },
    { id: 2, name: 'Hackathon', date: '2025-02-18', description: 'Join our 24-hour coding event.' },
    { id: 3, name: 'Webinar on AI', date: '2025-02-20', description: 'Learn the latest trends in AI.' }
  ]);

  const [currentEvent, setCurrentEvent] = useState(events[0]);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  const handleRegister = (eventId) => {
    const eventToRegister = events.find(event => event.id === eventId);
    if (eventToRegister && !registeredEvents.includes(eventToRegister)) {
      setRegisteredEvents([...registeredEvents, eventToRegister]);
    }
  };

  return (
    <div className="events-page">
      <h1 className="page-title">Events Page</h1>

      {/* All Events Section */}
      <section className="all-events-section">
        <h2>All Events</h2>
        <ul className="events-list">
          {events.map(event => (
            <li key={event.id} className="event-item">
              <h3>{event.name}</h3>
              <p><strong>Date:</strong> {event.date}</p>
              <p>{event.description}</p>
              <button onClick={() => handleRegister(event.id)}>Register</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Notification of Current Event */}
      <section className="current-event-section">
        <h2>Notification of Current Event</h2>
        {currentEvent ? (
          <div className="current-event">
            <h3>{currentEvent.name}</h3>
            <p><strong>Date:</strong> {currentEvent.date}</p>
            <p>{currentEvent.description}</p>
          </div>
        ) : (
          <p>No current event selected.</p>
        )}
      </section>

      {/* Registered Events Section */}
      <section className="registered-events-section">
        <h2>Registered Events</h2>
        {registeredEvents.length > 0 ? (
          <ul className="registered-events-list">
            {registeredEvents.map(event => (
              <li key={event.id} className="registered-event-item">
                <h3>{event.name}</h3>
                <p><strong>Date:</strong> {event.date}</p>
                <p>{event.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events registered yet.</p>
        )}
      </section>
    </div>
  );
};

export default EventsPage;
