import Property from '../models/property.model.js';

export const getAllProperties = async (req, res) => {
    try {
        const role = req.auth.role;

        // Filter properties based on user role
        let query = {};
        if (role === 'RealEstateAgent') {
            query = { listed: true }; // Real Estate Agents see listed properties
        } else if (role === 'Investor') {
            query = { value: { $gte: 1000000 } }; // Investors see properties above a certain value
        }

        const properties = await Property.find(query);
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        // Restrict sensitive information
        if (req.auth.role === 'Investor') {
            delete property.purchase_price; // Remove sensitive details
            delete property.purchase_date;
        }

        res.json(property);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};