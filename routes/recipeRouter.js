const express = require('express');
const recipeController = require('../controllers/recipeController');
const router = express.Router();

router.post('/', recipeController.createRecipe);
router.get('/', recipeController.getRecipes);
router.post('/criteria', recipeController.getRecipesByCriteria);
router.get('/:id', recipeController.getRecipeById);
router.get('/user/:id', recipeController.getRecipesByUser);
router.get('/chef/:id', recipeController.getRecipeByChef);
router.put('/:id', recipeController.updateRecipe);

module.exports = router;