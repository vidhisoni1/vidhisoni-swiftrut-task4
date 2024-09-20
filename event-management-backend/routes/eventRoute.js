const express = require('express');
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const upload = require('../middleware/cloudinary');
const router = express.Router();

router.post('/create', auth, upload.single('image'), async (req, res) => {
    const { title, description, date, location, maxAttendees } = req.body;
    const imageUrl = req.file ? req.file.path : ''; // Get image URL from Cloudinary
  
    try {
      const event = new Event({
        title,
        description,
        date,
        location,
        maxAttendees,
        imageUrl, // Store image URL in the event
        createdBy: req.user.id,
      });
  
      await event.save();
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ msg: 'Unable to create event' });
    }
  });
// Get all events with optional filters
router.get('/', async (req, res) => {
    try {
      const { date, location, type } = req.query; // Extract query parameters from URL
      let query = {};
  
      // Add filters to the query if they exist
      if (date) {
        query.date = new Date(date); // Filter by exact date
      }
      if (location) {
        query.location = { $regex: location, $options: 'i' }; // Filter by location (case insensitive)
      }
      if (type) {
        query.type = type; // Filter by event type
      }
  
      const events = await Event.find(query).populate('createdBy', 'name email');
      res.json(events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error, unable to fetch events' });
    }
  });
  
// Create a new event
router.post('/create', auth, async (req, res) => {
  const { title, description, date, location, maxAttendees, imageUrl } = req.body;

  try {
    const event = new Event({
      title,
      description,
      date,
      location,
      maxAttendees,
      imageUrl,
      createdBy: req.user.id, // Get user ID from JWT
    });

    await event.save();
    res.status(201).json({ msg: 'Event created successfully', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error, unable to create event' });
  }
});
// Delete an event (only the creator can delete)
router.delete('/:id', auth, async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
  
      if (!event) {
        return res.status(404).json({ msg: 'Event not found' });
      }
  
      // Check if the current user is the creator of the event
      if (event.createdBy.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized to delete this event' });
      }
  
      await event.remove();
      res.json({ msg: 'Event deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error, unable to delete event' });
    }
  });
  

module.exports = router;
