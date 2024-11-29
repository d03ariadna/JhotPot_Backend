const express = require('express');
const userIngredientController = require('../controllers/userIngredientController');
const router = express.Router();

router.post('/', userIngredientController.createUserIngredient);
router.get('/:userId', userIngredientController.getUserIngredients);
router.put('/:id', userIngredientController.updateUserIngredient);
router.delete('/:id', userIngredientController.deleteUserIngredient);

module.exports = router;