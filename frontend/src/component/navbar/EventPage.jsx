import React, { useState, useEffect } from 'react';
import "../../style/navbar/EventPage.css";
import { format, parseISO } from 'date-fns';
import { Calendar, CheckCircle, AlertTriangle } from 'lucide-react';

const EventsPage = () => {
    const [events, setEvents] = useState([
        { id: 1, name: 'Alumni Meetup', date: '2025-02-15', description: 'Reconnect with alumni and network. Share your experiences and build new connections.' },
        { id: 2, name: 'Hackathon', date: '2025-02-18', description: 'Join our 24-hour coding event.  Compete, learn, and create innovative solutions.' },
        { id: 3, name: 'Webinar on AI', date: '2025-02-20', description: 'Learn the latest trends in AI from industry experts. Discover how AI is shaping the future.' },
        { id: 4, name: 'Career Fair', date: '2025-02-25', description: 'Meet with leading companies and explore career opportunities.  Bring your resume!' },
        { id: 5, name: 'Guest Lecture', date: '2025-03-01', description: 'Attend a lecture by a renowned speaker in the field of technology. Get inspired and expand your knowledge.' }
    ]);

    const [currentEvent, setCurrentEvent] = useState(null);
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [registrationError, setRegistrationError] = useState(false);

    useEffect(() => {
        // Simulate fetching the current event from an API
        const now = new Date();
        const upcomingEvents = events.filter(event => parseISO(event.date) >= now).sort((a, b) => parseISO(a.date) - parseISO(b.date));
        setCurrentEvent(upcomingEvents[0] || null);  //Set it to the nearest upcoming event
    }, [events]);

    const handleRegister = (eventId) => {
        const eventToRegister = events.find(event => event.id === eventId);
        if (eventToRegister && !registeredEvents.some(event => event.id === eventId)) {
            setRegisteredEvents([...registeredEvents, eventToRegister]);
            setRegistrationSuccess(true);
            setRegistrationError(false);
            setTimeout(() => setRegistrationSuccess(false), 3000);  //Clear the success message after 3 seconds
        } else {
            setRegistrationError(true);
            setRegistrationSuccess(false);
            setTimeout(() => setRegistrationError(false), 3000); // Clear the error message after 3 seconds
        }
    };

    const formatDate = (dateString) => {
        try {
            return format(parseISO(dateString), 'MMMM dd, yyyy');
        } catch (error) {
            console.error("Error parsing date:", error);
            return "Invalid Date";
        }
    };

    return (
        <div className="events-page">
            <h1 className="page-title">Upcoming Events</h1>

            {/* Current Event Section */}
            <section className="current-event-section">
                <h2><Calendar className="section-icon" /> Featured Event</h2>
                {currentEvent ? (
                    <div className="current-event">
                        <h3>{currentEvent.name}</h3>
                        <p><strong className="event-date"><Calendar className="inline-icon" /> {formatDate(currentEvent.date)}</strong></p>
                        <p className="event-description">{currentEvent.description}</p>
                        <button className="register-button" onClick={() => handleRegister(currentEvent.id)}>Register Now</button>
                    </div>
                ) : (
                    <div className="no-events">
                        <AlertTriangle className="no-events-icon" />
                        <p>No upcoming events scheduled at the moment. Check back soon!</p>
                    </div>
                )}
            </section>

            {/* All Events Section */}
            <section className="all-events-section">
                <h2><Calendar className="section-icon" /> All Events</h2>
                <ul className="events-list">
                    {events.map(event => (
                        <li key={event.id} className="event-item">
                            <h3>{event.name}</h3>
                            <p><strong className="event-date"><Calendar className="inline-icon" /> {formatDate(event.date)}</strong></p>
                            <p className="event-description">{event.description}</p>
                            <button className="register-button" onClick={() => handleRegister(event.id)}>Register</button>
                        </li>
                    ))}
                </ul>
            </section>


            {/* Registered Events Section */}
            <section className="registered-events-section">
                <h2><CheckCircle className="section-icon" /> Registered Events</h2>
                {registeredEvents.length > 0 ? (
                    <ul className="registered-events-list">
                        {registeredEvents.map(event => (
                            <li key={event.id} className="registered-event-item">
                                <h3>{event.name}</h3>
                                <p><strong className="event-date"><Calendar className="inline-icon" /> {formatDate(event.date)}</strong></p>
                                <p className="event-description">{event.description}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="no-events">
                        <AlertTriangle className="no-events-icon" />
                        <p>No events registered yet. Explore the available events and sign up!</p>
                    </div>
                )}
            </section>

            {/* Success/Error Messages */}
            {registrationSuccess && (
                <div className="success-message">
                    <CheckCircle className="message-icon" />
                    Successfully registered!
                </div>
            )}
            {registrationError && (
                <div className="error-message">
                    <AlertTriangle className="message-icon" />
                    Registration failed. You may already be registered for this event.
                </div>
            )}
        </div>
    );
};

export default EventsPage;
