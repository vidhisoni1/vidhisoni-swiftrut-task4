import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const EditEvent = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [maxAttendees, setMaxAttendees] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Add error message state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const { data } = await api.get(`/events/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEvent(data);
                setTitle(data.title);
                setDescription(data.description);
                setDate(data.date.split('T')[0]);
                setLocation(data.location);
                setMaxAttendees(data.maxAttendees);
            } catch (error) {
                console.error('Error fetching event:', error.response ? error.response.data : error.message);
            }
        };
        fetchEvent();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const updatedEvent = { title, description, date, location, maxAttendees };
            await api.put(`/events/${id}`, updatedEvent, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate('/my-events');
        } catch (error) {
            const message = error.response ? error.response.data.error : error.message;
            setErrorMessage(message); // Set error message if any
            console.error('Error updating event:', message);
        }
    };

    if (!event) return <p>Loading event data...</p>;

    return (
        <div className="container mt-5 col-5 bg-dark rounded-1 p-4">
            <h2 className='text-center text-light'>Edit Event</h2>
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
            <form onSubmit={handleUpdate}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-labe text-lightl">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label text-light">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="date" className="form-label text-light">Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="location" className="form-label text-light">Location</label>
                    <input
                        type="text"
                        className="form-control"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="maxAttendees" className="form-label text-light">Max Attendees</label>
                    <input
                        type="number"
                        className="form-control"
                        id="maxAttendees"
                        value={maxAttendees}
                        onChange={(e) => setMaxAttendees(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-danger w-100">
                    Update Event
                </button>
            </form>
        </div>
    );
};

export default EditEvent;
