import express from 'express';
import { getAllLiens, getLienById } from '../controllers/lien.controller.js';
import authCtrl from '../controllers/auth.controller.js';

const router = express.Router();

// Only Admins and Mortgage Brokers can view liens
router.get('/', authCtrl.requireSignin, authCtrl.authorizeRoles(['Administrator', 'MortgageBroker']), getAllLiens);
router.get('/:id', authCtrl.requireSignin, authCtrl.authorizeRoles(['Administrator', 'MortgageBroker']), getLienById);

export default router;