const Lien = require('../models/liens');

exports.getAllLiens = async (req, res) => {
  try {
    const liens = await Lien.find().populate('property_id');
    res.json(liens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};