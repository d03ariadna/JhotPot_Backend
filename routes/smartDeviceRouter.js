const express = require('express');
const smartDeviceController = require('../controllers/smartDeviceController');
const router = express.Router();

router.post('/', smartDeviceController.createSmartDevice);
router.get('/:userId', smartDeviceController.getSmartDevicesByUser);
router.get('/:deviceId/ingredients', smartDeviceController.getIngredientsInSmartDevice);
router.put('/:id', smartDeviceController.updateSmartDevice);
router.delete('/:id', smartDeviceController.deleteSmartDevice);

module.exports = router;