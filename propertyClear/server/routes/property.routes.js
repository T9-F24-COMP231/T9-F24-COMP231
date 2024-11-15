import express from 'express';
import { getAllProperties, getPropertyById } from '../controllers/property.controller.js';
const router = express.Router();

router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// module.exports = router;
export default router;