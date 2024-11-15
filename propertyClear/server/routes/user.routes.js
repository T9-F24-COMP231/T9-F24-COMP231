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

router.get('/data', authCtrl.requireSignin, getUserData);
router.get('/admin/users', authCtrl.requireSignin, authCtrl.authorizeRoles(['Administrator']), getAllUsers);
router.get('/broker/mortgage/:propertyId', authCtrl.requireSignin, authCtrl.authorizeRoles(['MortgageBroker']), getMortgageData);
router.get('/agent/listings', authCtrl.requireSignin, authCtrl.authorizeRoles(['RealEstateAgent']), getListings);

export default router;

