import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const EventDetails = () => {
    const { id } = useParams(); // Get the event ID from the route params
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (error) {
                console.error('Error fetching event details:', error.response ? error.response.data : error.message);
            }
        };
        fetchEvent();
    }, [id]);

    if (!event) return <p>Loading event details...</p>;

    return (
        <div className="container mt-4">
            <div className="card bg-dark p-2 ">
                <div className="card-body">
                    <h4 className="card-title text-light">{event.title}</h4>
                    <p className="card-text text-light">{event.description}</p>
                    <div className="mt-4">
                        <p className="card-text text-light"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                        <p className="card-text text-light"><strong>Location:</strong> {event.location}</p>
                        <p className="card-text text-light"><strong>Max Attendees:</strong> {event.maxAttendees}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
