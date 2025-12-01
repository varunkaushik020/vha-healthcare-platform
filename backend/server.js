const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const patientRoutes = require('./routes/patientRoutes');
const providerRoutes = require('./routes/providerRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        console.log('Please ensure your MongoDB URI is correct in the .env file');
    });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('MongoDB connection established successfully');
});

app.get('/', (req, res) => {
    res.json({ message: 'VHA Backend Server is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/providers', providerRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});