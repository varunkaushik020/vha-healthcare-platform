const express = require('express');
const router = express.Router();
const {
    patientLogin,
    providerLogin
} = require('../controllers/authController');

router.post('/patient/login', patientLogin);

router.post('/provider/login', providerLogin);

module.exports = router;