const express = require('express');
const ingredientController = require('../controllers/ingredientController');
const router = express.Router();

router.get('/', ingredientController.getIngredients);
router.get('/:name', ingredientController.getIdByName);

module.exports = router;