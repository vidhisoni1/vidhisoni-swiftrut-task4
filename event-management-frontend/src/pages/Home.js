import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [events, setEvents] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/events');
        setEvents(res.data);
      } catch (error) {
        console.error('Error fetching events', error);
      }
    };

    fetchEvents();
  }, []);

  const handleRSVP = async (eventId) => {
    try {
      await axios.post(`/api/events/${eventId}/rsvp`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('RSVP successful!');
    } catch (error) {
      console.error('Error RSVPing to event', error);
      alert('Error RSVPing to event');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Upcoming Events</h2>
      <div className="row">
        {events.length > 0 ? (
          events.map((event) => (
            <div className="col-md-4 mb-4" key={event._id}>
              <div className="card">
                <img src={event.imageUrl} className="card-img-top" alt={event.title} />
                <div className="card-body">
                  <h5 className="card-title">{event.title}</h5>
                  <p className="card-text">{event.description}</p>
                  <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                  <p><strong>Created by:</strong> {event.createdBy.name}</p>
                  {user && (
                    <button className="btn btn-primary" onClick={() => handleRSVP(event._id)}>
                      RSVP
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No events available.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
