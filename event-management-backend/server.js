const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require('node-cron');
const Event = require('./models/Event'); // Import Event model
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
// const authRoutes = require('./routes/authRoute');
// const eventRoute = require('./routes/eventRoute')
const { CloudinaryStorage } = require('multer-storage-cloudinary');


   


// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'event_images', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'png']
  }
});

const upload = multer({ storage });


// Run a cron job every day at midnight to send reminders for upcoming events
cron.schedule('0 0 * * *', async () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Set the date to tomorrow

  // Find events happening tomorrow
  const upcomingEvents = await Event.find({
    date: { $gte: today, $lte: tomorrow }
  });

  upcomingEvents.forEach(event => {
    // Send notification to each attendee (You can use FCM, email, etc.)
    event.attendees.forEach(attendee => {
      console.log(`Reminder: The event ${event.title} is happening tomorrow.`);
      // Trigger notification here (email, push, etc.)
    });
  });
});


dotenv.config(); // Load .env file
const app = express();
const eventRoutes = require('./routes/eventRoute');
app.use('/api/events', eventRoutes);

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoute');
const eventRoute = require('./routes/eventRoute');

// Use routes
app.use('/api/authRoute', authRoutes);  // For registration and login
app.use('/api/event', eventRoute);  // For event management

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
