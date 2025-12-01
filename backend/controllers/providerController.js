const Provider = require('../models/Provider');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerProvider = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, licenseNumber, specialty, yearsOfExperience, password } = req.body;

        const existingProvider = await Provider.findOne({ email });
        if (existingProvider) {
            return res.status(400).json({ message: 'Provider already exists with this email' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const provider = new Provider({
            firstName,
            lastName,
            email,
            phone,
            licenseNumber,
            specialty,
            yearsOfExperience,
            password: hashedPassword
        });

        const savedProvider = await provider.save();

        const token = jwt.sign(
            { id: savedProvider._id, userType: 'provider' },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '7d' }
        );

        const providerData = {
            _id: savedProvider._id,
            firstName: savedProvider.firstName,
            lastName: savedProvider.lastName,
            email: savedProvider.email,
            phone: savedProvider.phone,
            licenseNumber: savedProvider.licenseNumber,
            specialty: savedProvider.specialty,
            yearsOfExperience: savedProvider.yearsOfExperience
        };

        res.status(201).json({ token, provider: providerData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllProviders = async (req, res) => {
    try {
        const providers = await Provider.find().select('-password');
        res.json(providers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProviderById = async (req, res) => {
    try {
        const provider = await Provider.findById(req.params.id).select('-password');
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        res.json(provider);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProvider = async (req, res) => {
    try {
        const provider = await Provider.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        res.json(provider);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteProvider = async (req, res) => {
    try {
        const provider = await Provider.findByIdAndDelete(req.params.id);
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        res.json({ message: 'Provider deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerProvider,
    getAllProviders,
    getProviderById,
    updateProvider,
    deleteProvider
};