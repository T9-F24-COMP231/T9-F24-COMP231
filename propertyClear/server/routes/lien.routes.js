import express from 'express';
import { getAllLiens, getLienById } from '../controllers/lien.controller.js';
const router = express.Router();

router.get('/', getAllLiens);
router.get('/:id', getLienById);

// module.exports = router;
export default router;