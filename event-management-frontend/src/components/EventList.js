import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import io from 'socket.io-client';  // Import socket.io

const socket = io('http://localhost:5000');  // Connect to the server

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [filters, setFilters] = useState({ startDate: '', endDate: '', location: '' });
    const { user } = useContext(AuthContext);

    const fetchEvents = async (filterParams = {}) => {
        try {
            const { data } = await api.get('/events', { params: filterParams });
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error.response ? error.response.data : error.message);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleFilterSubmit = () => {
        fetchEvents(filters);
    };

    const handleRSVP = async (eventId) => {
        try {
            const token = localStorage.getItem('authToken');
            await api.post(`/events/${eventId}/rsvp`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchEvents(); // Refresh events after RSVP
        } catch (error) {
            console.error('Error RSVPing for event:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        fetchEvents();

        // Listen for updates from the server
        socket.on('eventUpdated', (data) => {
            alert(`Event Update: ${data.message}`);  // Show notification when an event is updated
            fetchEvents();  // Refresh the events list when an event is updated
        });

        return () => {
            socket.off('eventUpdated');  // Cleanup when component unmounts
        };
    }, []);

    return (
        <div className="container mt-4    ">
            <h2 className='text-dark text-center'>Upcoming Events</h2>

            {/* Filters */}
            <div className="row mb-3">
                <div className="col-sm-4 mb-3 ">
                    <input
                        type="date"
                        className="form-control "
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        placeholder="Start Date"
                    />
                </div>
                <div className="col-sm-4 mb-3">
                    <input
                        type="date"
                        className="form-control"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        placeholder="End Date"
                    />
                </div>
                <div className="col-sm-4 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        name="location"
                        value={filters.location}
                        onChange={handleFilterChange}
                        placeholder="Location"
                    />
                </div>
                <div className="col-sm-12">
                    <button className="btn btn-danger w-100" onClick={handleFilterSubmit}>
                        Apply Filters
                    </button>
                </div>
            </div>

            {/* Event List */}
            <div className="row">
                {events.map((event) => (
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
                                <p className='text-light'>Date: {new Date(event.date).toLocaleDateString()}</p>
                                <p className='text-light'>Location: {event.location}</p>
                                <p className='text-light'> 
                                    Attendees: {event.attendees.length}/{event.maxAttendees}
                                </p>
                                <Link to={`/events/${event._id}`} className="btn btn-warning text-light">
                                    View Details
                                </Link>

                                {user && (
                                    <button
                                        className="btn btn-success mt-2 w-100"
                                        onClick={() => handleRSVP(event._id)}
                                        disabled={event.attendees.length >= event.maxAttendees}
                                    >
                                        {event.attendees.length >= event.maxAttendees
                                            ? 'Max Attendees Reached'
                                            : 'I am in'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventList;
