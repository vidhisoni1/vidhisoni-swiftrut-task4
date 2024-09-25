const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    maxAttendees: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    attendees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
