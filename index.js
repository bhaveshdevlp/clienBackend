// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();
// const jwt = require('jsonwebtoken');
// const imageRoutes = require('./routes/images');
// const app = express();

// // Middleware
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:3000'
// }));
// app.use(express.json());

// // Routes
// app.use('/api/images', imageRoutes);

// // Function to create initial admin user
// const createInitialAdmin = async () => {
//   try {
//     // Check if admin already exists
//     const adminExists = await User.findOne({ 
//       username: process.env.INITIAL_ADMIN_USERNAME 
//     });
    
//     if (!adminExists && process.env.INITIAL_ADMIN_USERNAME && process.env.INITIAL_ADMIN_PASSWORD) {
//       const adminUser = new User({
//         username: process.env.INITIAL_ADMIN_USERNAME,
//         password: process.env.INITIAL_ADMIN_PASSWORD
//       });
//       await adminUser.save();
//       console.log('Initial admin user created successfully');
//     } else if (adminExists) {
//       console.log('Admin user already exists');
//     } else {
//       console.log('Initial admin credentials not found in environment variables');
//     }
//   } catch (error) {
//     console.error('Error creating initial admin:', error);
//   }
// };
// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('Could not connect to MongoDB', err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User= require('./model/users');

// Import routes correctly
const authRoutes = require('./routes/auth');
const imageRoutes = require('./routes/images');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes - use them as middleware
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to create initial admin user
const createInitialAdmin = async () => {
  try {
    const adminExists = await User.findOne({ 
      username: process.env.INITIAL_ADMIN_USERNAME 
    });
    
    if (!adminExists && process.env.INITIAL_ADMIN_USERNAME && process.env.INITIAL_ADMIN_PASSWORD) {
      const adminUser = new User({
        username: process.env.INITIAL_ADMIN_USERNAME,
        password: process.env.INITIAL_ADMIN_PASSWORD
      });
      await adminUser.save();
      console.log('Initial admin user created successfully');
    } else if (adminExists) {
      console.log('Admin user already exists');
    } else {
      console.log('Initial admin credentials not found in environment variables');
    }
  } catch (error) {
    console.error('Error creating initial admin:', error);
  }
};

// Create admin when MongoDB connects successfully
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  createInitialAdmin();
});

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});