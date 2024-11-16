const Property = require('../models/properties');

exports.getAllProperties = async (req, res) => {
  try {
    const includeTaxes = req.user && (req.user.role === 'investor' || req.user.role === 'agent');
    
    // Conditionally include taxes if user is an investor or agent
    const projection = includeTaxes
      ? { street: 1, city: 1, postalCode: 1, province: 1, country: 1, propertyType: 1, sizeSqft: 1, value: 1, purchase_price: 1, purchase_date: 1, taxes: 1 }
      : { street: 1, city: 1, postalCode: 1, province: 1, country: 1, propertyType: 1, sizeSqft: 1, value: 1, purchase_price: 1, purchase_date: 1 };

    const properties = await Property.find({}, projection);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};