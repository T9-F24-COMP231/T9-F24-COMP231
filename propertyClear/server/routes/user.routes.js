// user.routes.js
import express from 'express';
import { 
  getUserData, 
  getAllUsers, 
  getMortgageData, 
  getListings 
} from '../controllers/user.controller.js';
import authCtrl from '../controllers/auth.controller.js';

const router = express.Router();

// Public Routes
router.get('/user/data', authCtrl.requireSignin, getUserData);

// Administrator Routes
router.get('/admin/users', authCtrl.requireSignin, authCtrl.authorizeRoles(['Administrator']), getAllUsers);

// Mortgage Broker Routes
router.get('/broker/mortgage/:propertyId', authCtrl.requireSignin, authCtrl.authorizeRoles(['MortgageBroker']), getMortgageData);

// Real Estate Agent Routes
router.get('/agent/listings', authCtrl.requireSignin, authCtrl.authorizeRoles(['RealEstateAgent']), getListings);

// Other role-specific routes can be added similarly

export default router;
