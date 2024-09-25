import { useState } from 'react';
import api from '../api';
import { Navigate } from 'react-router-dom';

const CreateEvent = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [maxAttendees, setMaxAttendees] = useState('');
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('date', date);
        formData.append('location', location);
        formData.append('maxAttendees', maxAttendees);
        if (image) formData.append('image', image);
    
        try {
            const token = localStorage.getItem('authToken'); // Get the token from localStorage
            const { data } = await api.post('/events/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` // Attach the token to the request
                },
            });
            Navigate('/my-events');
            console.log('Event created:', data);
        } catch (error) {
            const message = error.response ? error.response.data.error : error.message;
            console.error('Error creating event:', message);
            setErrorMessage(message);
        }
    };

    return (
        <div className="container mt-5">
            <div className='col-5 mx-auto bg-dark p-4 rounded-1'>
            <h2 className='text-center text-light'>Create Event</h2>
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
            <form onSubmit={handleCreateEvent}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label text-light">Title</label>
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
                <div className="mb-3">
                    <label htmlFor="image" className="form-label text-light">Upload Image</label>
                    <input
                        type="file"
                        className="form-control"
                        id="image"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <button type="submit" className="btn btn-danger w-100">
                    Create Event
                </button>
            </form>
        </div>
        </div>
    );
};

export default CreateEvent;
