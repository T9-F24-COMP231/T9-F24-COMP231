// user.controller.js
import User from '../models/user.model.js';
import Property from '../models/property.model.js';

// Common user data retrieval
export const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.auth._id).select("name email role");
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Admin: Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
};

// Mortgage Broker: Access mortgage-related data
export const getMortgageData = async (req, res) => {
    try {
        const property = await Property.findById(req.params.propertyId);
        if (!property) return res.status(404).json({ error: 'Property not found' });
        // Customize the data returned here for mortgage brokers
        res.json({ mortgageDetails: property.mortgageDetails });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve mortgage data' });
    }
};

// Real Estate Agent: Access property listings
export const getListings = async (req, res) => {
    try {
        const properties = await Property.find({ listed: true });
        res.json(properties);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve listings' });
    }
};
