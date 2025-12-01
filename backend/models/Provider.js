const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    licenseNumber: {
        type: String,
        required: true
    },
    specialty: {
        type: String,
        required: true
    },
    yearsOfExperience: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Provider', providerSchema);