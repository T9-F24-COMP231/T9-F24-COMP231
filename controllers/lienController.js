const Lien = require('../models/liens');

exports.getAllLiens = async (req, res) => {
  try {
    const includeTaxes = req.user && (req.user.role === 'investor' || req.user.role === 'agent');
    
    // Conditionally include taxes if user is an investor or agent
    const projection = includeTaxes
      ? { lien_id: 1, owner_id: 1, property_id: 1, lien_type: 1, lien_amount: 1, interestRate: 1, lender_name: 1, lienStartDate: 1, lienDueDate: 1, date_filed: 1, lien_status: 1, taxes: 1 }
      : { lien_id: 1, owner_id: 1, property_id: 1, lien_type: 1, lien_amount: 1, interestRate: 1, lender_name: 1, lienStartDate: 1, lienDueDate: 1, date_filed: 1, lien_status: 1 };

    const liens = await Lien.find().populate('property_id', projection);
    res.json(liens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};