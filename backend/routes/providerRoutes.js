const express = require('express');
const router = express.Router();
const {
    registerProvider,
    getAllProviders,
    getProviderById,
    updateProvider,
    deleteProvider
} = require('../controllers/providerController');

router.post('/', registerProvider);

router.get('/', getAllProviders);

router.get('/:id', getProviderById);

router.put('/:id', updateProvider);

router.delete('/:id', deleteProvider);

module.exports = router;