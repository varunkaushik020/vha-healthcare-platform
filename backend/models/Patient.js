const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
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
    dateOfBirth: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    healthData: {
        heartRate: {
            type: Number,
            default: 72
        },
        bloodPressure: {
            systolic: {
                type: Number,
                default: 120
            },
            diastolic: {
                type: Number,
                default: 80
            }
        },
        glucose: {
            type: Number,
            default: 95
        },
        weight: {
            type: Number,
            default: 70
        },
        height: {
            type: Number,
            default: 170
        }
    },
    healthHistory: [{
        date: {
            type: Date,
            default: Date.now
        },
        heartRate: Number,
        bloodPressure: {
            systolic: Number,
            diastolic: Number
        },
        glucose: Number,
        weight: Number
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema);