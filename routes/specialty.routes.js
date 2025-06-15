const express = require('express');
const router = express.Router();
const { createSpecialty, getAllSpecialties } = require('../controllers/specialtyController');
const validateToken = require('../middleware/validateToken');

router.post('/',validateToken, createSpecialty);
router.get('/', getAllSpecialties);

module.exports = router;
