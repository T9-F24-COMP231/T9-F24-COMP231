import Lien from '../models/liens.model.js';

export const getAllLiens = async (req, res) => {  // Use export instead of exports
  try {
    const liens = await Lien.find().populate('property_id');
    res.json(liens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLienById = async (req, res) => {  // Assuming you have this method as well
  try {
    const lien = await Lien.findById(req.params.id).populate('property_id');
    if (!lien) return res.status(404).json({ message: 'Lien not found' });
    res.json(lien);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
