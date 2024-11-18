import express from 'express';
import { getAllProperties, getPropertyById } from '../controllers/property.controller.js';
import authCtrl from '../controllers/auth.controller.js';

const router = express.Router();

// Allow only certain roles access to properties
router.get('/', authCtrl.requireSignin, authCtrl.authorizeRoles(['Administrator', 'RealEstateAgent', 'Investor']), getAllProperties);
router.get('/:id', authCtrl.requireSignin, authCtrl.authorizeRoles(['Administrator', 'RealEstateAgent', 'Investor']), getPropertyById);

export default router;