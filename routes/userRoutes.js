const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/', userController.getUsers);
router.get('/chefs/:id', userController.getChefs);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/:id', userController.updateUser);

router.get('/userData/:id', userController.getUserData);

router.put('/addReview/:id', userController.addReview);

router.get('/savedRecipes/:id', userController.getSavedRecipes);
router.put('/savedRecipes/:id', userController.toggleSavedRecipe);

router.get('/sharedRecipes/:id', userController.getSharedRecipes);
router.put('/sharedRecipes/:id', userController.updateSharedRecipes);

router.post('/validateKey', userController.validateKey);


module.exports = router;