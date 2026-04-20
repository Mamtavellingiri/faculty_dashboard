require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const facultyRoutes = require('./routes/facultyRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/faculty', facultyRoutes);

// Base route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Faculty Academic Performance Dashboard API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
