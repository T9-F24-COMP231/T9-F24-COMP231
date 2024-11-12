const { Schema } = require('mongoose');
const propertiesDB = require('../config/propertiesDB'); // Use propertiesDB connection

const propertySchema = new Schema({
  property_id: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  owner_id: { type: Schema.Types.ObjectId, ref: 'Owner' },
  value: { type: Number, required: true },
  status: { type: String, default: 'Available' },
  description: { type: String },
  listing_date: { type: Date, default: Date.now },
});

module.exports = propertiesDB.model('Property', propertySchema);