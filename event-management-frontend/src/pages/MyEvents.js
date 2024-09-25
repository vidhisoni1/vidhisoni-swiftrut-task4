import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const MyEvents = () => {
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchMyEvents = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const { data } = await api.get('/events/my-events', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMyEvents(data);
        } catch (error) {
            console.error('Error fetching my events:', error.response ? error.response.data : error.message);
        }
    };

    const handleDelete = async (eventId) => {
        const token = localStorage.getItem('authToken');
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                setLoading(true);
                await api.delete(`/events/${eventId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLoading(false);
                fetchMyEvents(); // Refresh the events after deletion
            } catch (error) {
                setLoading(false);
                console.error('Error deleting event:', error.response ? error.response.data : error.message);
            }
        }
    };

    const handleEdit = (eventId) => {
        navigate(`/edit-event/${eventId}`); // Redirect to the edit page with event ID
    };

    useEffect(() => {
        fetchMyEvents();
    }, []);

    return (
        <div className="container mt-4">
            <h2 className='text-center p-4'>My Created Events</h2>
            <div className="row">
                {myEvents.map((event) => (
                    <div className="col-md-4 mb-4" key={event._id}>
                        <div className="card h-100 bg-dark p-2">
                            {event.imageUrl && (
                                <img
                                    src={`http://localhost:5000${event.imageUrl}`}
                                    className="card-img-top"
                                    alt={event.title}
                                    style={{ height: '140px', objectFit: 'cover' }}
                                />
                            )}
                            <div className="card-body">
                                <h5 className="card-title text-light">{event.title}</h5>
                                <p className="card-text text-light">{event.description}</p>
                                <p className='text-light'><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                                <p className='text-light'><strong>Location:</strong> {event.location}</p>
                                <p className='text-light'><strong>Created by:</strong> {event.creator.username} ({event.creator.email})</p>
                                <p className='text-light'><strong>Attendees:</strong></p>
                                <ul>
                                    {event.attendees.map((attendee) => (
                                        <li key={attendee._id}>
                                            {attendee.username} ({attendee.email})
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    className="btn btn-warning mr-2"
                                    onClick={() => handleEdit(event._id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-success m-2"
                                    onClick={() => handleDelete(event._id)}
                                    disabled={loading}
                                >
                                    {loading ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyEvents;
