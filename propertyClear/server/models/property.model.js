import { Schema } from 'mongoose'; // Using import instead of require
import propertiesDB from '../config/propertiesDB.js'; // Same here, use import

const propertySchema = new Schema({
  property_id: { type: String, required: true, unique: true },
  owner_id: { type: Schema.Types.ObjectId, ref: 'Owner' },
  street: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  province: { type: String, required: true },
  country: { type: String, required: true },
  propertyType: { type: String, required: true },
  sizeSqft: { type: Number, required: true },
  value: { type: Number, required: true },
  purchase_price: { type: Number, required: true },  
  purchase_date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// module.exports = propertiesDB.model('Property', propertySchema);
export default propertiesDB.model('Property', propertySchema);