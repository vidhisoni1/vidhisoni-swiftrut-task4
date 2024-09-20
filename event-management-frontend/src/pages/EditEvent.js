import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditEvent = () => {
  const { id } = useParams(); // Get event ID from the URL
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`);
        const event = res.data;
        setTitle(event.title);
        setDescription(event.description);
        setDate(event.date);
        setLocation(event.location);
        setMaxAttendees(event.maxAttendees);
      } catch (error) {
        console.error('Error fetching event data', error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedEvent = { title, description, date, location, maxAttendees };
      await axios.put(`/api/events/${id}`, updatedEvent, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      navigate('/'); // Redirect to home after updating
    } catch (error) {
      console.error('Error updating event', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Event</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
        required
      />
      <input
        type="number"
        value={maxAttendees}
        onChange={(e) => setMaxAttendees(e.target.value)}
        placeholder="Max Attendees"
        required
      />
      <button type="submit">Update Event</button>
    </form>
  );
};

export default EditEvent;
