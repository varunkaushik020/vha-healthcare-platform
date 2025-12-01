const Patient = require('../models/Patient');
const Provider = require('../models/Provider');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const patientLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const patient = await Patient.findOne({ email });
        if (!patient) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: patient._id, userType: 'patient' },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '7d' }
        );

        const patientData = {
            _id: patient._id,
            firstName: patient.firstName,
            lastName: patient.lastName,
            email: patient.email,
            phone: patient.phone,
            dateOfBirth: patient.dateOfBirth,
            healthData: {
                heartRate: patient.healthData.heartRate,
                bloodPressure: {
                    systolic: patient.healthData.bloodPressure.systolic,
                    diastolic: patient.healthData.bloodPressure.diastolic
                },
                glucose: patient.healthData.glucose,
                weight: patient.healthData.weight
            }
        };

        res.json({ token, patient: patientData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const providerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const provider = await Provider.findOne({ email });
        if (!provider) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, provider.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: provider._id, userType: 'provider' },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '7d' }
        );

        const providerData = {
            _id: provider._id,
            firstName: provider.firstName,
            lastName: provider.lastName,
            email: provider.email,
            phone: provider.phone,
            licenseNumber: provider.licenseNumber,
            specialty: provider.specialty,
            yearsOfExperience: provider.yearsOfExperience
        };

        res.json({ token, provider: providerData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    patientLogin,
    providerLogin
};