const Patient = require('../models/Patient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerPatient = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, dateOfBirth, password } = req.body;

        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({ message: 'Patient already exists with this email' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const patient = new Patient({
            firstName,
            lastName,
            email,
            phone,
            dateOfBirth,
            password: hashedPassword
        });

        const savedPatient = await patient.save();

        const token = jwt.sign(
            { id: savedPatient._id, userType: 'patient' },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '7d' }
        );

        const patientData = {
            _id: savedPatient._id,
            firstName: savedPatient.firstName,
            lastName: savedPatient.lastName,
            email: savedPatient.email,
            phone: savedPatient.phone,
            dateOfBirth: savedPatient.dateOfBirth,
            healthData: {
                heartRate: savedPatient.healthData.heartRate,
                bloodPressure: {
                    systolic: savedPatient.healthData.bloodPressure.systolic,
                    diastolic: savedPatient.healthData.bloodPressure.diastolic
                },
                glucose: savedPatient.healthData.glucose,
                weight: savedPatient.healthData.weight
            }
        };

        res.status(201).json({ token, patient: patientData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find().select('-password');
        const patientsWithHealthData = patients.map(patient => ({
            ...patient.toObject(),
            healthData: {
                heartRate: patient.healthData.heartRate,
                bloodPressure: {
                    systolic: patient.healthData.bloodPressure.systolic,
                    diastolic: patient.healthData.bloodPressure.diastolic
                },
                glucose: patient.healthData.glucose,
                weight: patient.healthData.weight
            }
        }));
        res.json(patientsWithHealthData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).select('-password');
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const patientData = {
            ...patient.toObject(),
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

        res.json(patientData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePatient = async (req, res) => {
    try {
        const { healthData, ...patientData } = req.body;

        const updateFields = { ...patientData };

        if (healthData) {
            if (healthData.heartRate !== undefined) updateFields['healthData.heartRate'] = healthData.heartRate;
            if (healthData.bloodPressure !== undefined) updateFields['healthData.bloodPressure'] = healthData.bloodPressure;
            if (healthData.glucose !== undefined) updateFields['healthData.glucose'] = healthData.glucose;
            if (healthData.weight !== undefined) updateFields['healthData.weight'] = healthData.weight;
            if (healthData.height !== undefined) updateFields['healthData.height'] = healthData.height;
        }

        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const responseData = {
            ...patient.toObject(),
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

        res.json(responseData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updatePatientHealthData = async (req, res) => {
    try {
        const { heartRate, bloodPressure, glucose, weight, height } = req.body;

        const updateFields = {};
        if (heartRate !== undefined) updateFields['healthData.heartRate'] = heartRate;
        if (bloodPressure !== undefined) updateFields['healthData.bloodPressure'] = bloodPressure;
        if (glucose !== undefined) updateFields['healthData.glucose'] = glucose;
        if (weight !== undefined) updateFields['healthData.weight'] = weight;
        if (height !== undefined) updateFields['healthData.height'] = height;

        const currentPatient = await Patient.findById(req.params.id);
        if (!currentPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const healthHistoryEntry = {
            date: new Date(),
            heartRate: currentPatient.healthData.heartRate,
            bloodPressure: {
                systolic: currentPatient.healthData.bloodPressure.systolic,
                diastolic: currentPatient.healthData.bloodPressure.diastolic
            },
            glucose: currentPatient.healthData.glucose,
            weight: currentPatient.healthData.weight
        };

        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            {
                $set: updateFields,
                $push: { healthHistory: healthHistoryEntry }
            },
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json({
            healthData: {
                heartRate: patient.healthData.heartRate,
                bloodPressure: {
                    systolic: patient.healthData.bloodPressure.systolic,
                    diastolic: patient.healthData.bloodPressure.diastolic
                },
                glucose: patient.healthData.glucose,
                weight: patient.healthData.weight
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getPatientHealthData = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).select('healthData');
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json({
            healthData: {
                heartRate: patient.healthData.heartRate,
                bloodPressure: {
                    systolic: patient.healthData.bloodPressure.systolic,
                    diastolic: patient.healthData.bloodPressure.diastolic
                },
                glucose: patient.healthData.glucose,
                weight: patient.healthData.weight
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPatientHealthHistory = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).select('healthHistory');
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json({ healthHistory: patient.healthHistory });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    updatePatientHealthData,
    getPatientHealthData,
    getPatientHealthHistory,
    deletePatient
};