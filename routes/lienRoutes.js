const express = require('express');
const router = express.Router();
const { getAllLiens, getLienById } = require('../controllers/lienController');

router.get('/', getAllLiens);
router.get('/:id', getLienById);

module.exports = router;