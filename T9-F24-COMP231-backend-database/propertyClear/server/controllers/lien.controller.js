import Lien from '../models/liens.model.js';

export const getAllLiens = async (req, res) => {
    try {
        const role = req.auth.role;

        // Adjust query based on roles
        let query = {};
        if (role === 'MortgageBroker') {
            query = { lien_status: 'Active' }; // Mortgage brokers can only see active liens
        }

        const liens = await Lien.find(query).populate('property_id');
        res.json(liens);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getLienById = async (req, res) => {
    try {
        const lien = await Lien.findById(req.params.id).populate('property_id');
        if (!lien) return res.status(404).json({ message: 'Lien not found' });

        // Restrict data for non-admin roles
        if (req.auth.role !== 'Administrator') {
            delete lien.lien_amount; // Remove sensitive fields
            delete lien.interestRate;
        }

        res.json(lien);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};