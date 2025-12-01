const express = require('express');
const router = express.Router();
const {
    registerPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    updatePatientHealthData,
    getPatientHealthData,
    getPatientHealthHistory,
    deletePatient
} = require('../controllers/patientController');

router.post('/', registerPatient);

router.get('/', getAllPatients);

router.get('/:id', getPatientById);

router.put('/:id', updatePatient);

router.put('/:id/health', updatePatientHealthData);

router.get('/:id/health', getPatientHealthData);

router.get('/:id/health/history', getPatientHealthHistory);

router.delete('/:id', deletePatient);

module.exports = router;