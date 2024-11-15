import { Schema } from 'mongoose';
import liensDB from '../config/liensDB.js'; // Use liensDB connection

const lienSchema = new Schema({
  lien_id: { type: String, required: true, unique: true },
  owner_id: { type: Schema.Types.ObjectId, ref: 'Owner' },
  property_id: { type: Schema.Types.ObjectId, ref: 'Property' },
  lien_type: { type: String, required: true },
  lien_amount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  lender_name: { type: String },
  lienStartDate: { type: Date, default: Date.now },
  lienDueDate: { type: Date, default: Date.now },
  date_filed: { type: Date, default: Date.now },
  lien_status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// module.exports = liensDB.model('Lien', lienSchema);
export default liensDB.model('Lien', lienSchema);