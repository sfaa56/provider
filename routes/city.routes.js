const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const validateToken = require('../middleware/validateToken');

router.post('/',validateToken, cityController.createCity);
router.get('/', cityController.getAllCities);
router.put('/:id', validateToken,cityController.updateCity);
router.delete('/:id', validateToken,cityController.deleteCity);

module.exports = router;
