// controllers/recipeController.js
const Recipe = require('../models/Recipe');
// const recipeValidator = require('../validators/recipeValidator');
const mongoose = require('mongoose');

const recipeController = {
    async createRecipe(req, res) {
        try {
            const recipe = new Recipe(req.body);
            console.log(recipe)
            await recipe.save();
            res.status(201).json({ message: "Recipe created successfully", recipe });
        } catch (error) {
            console.log(error)
            res.status(500).json({message: "Error creating recipe", error});
        }
    },



    async getRecipeById(req, res) {
        try {
            const id = req.params.id;
            const recipe = await Recipe.findById(id)
                .populate('chefId')
                .populate('ingredients.ingredientId');
            
            if (!recipe) return res.status(404).json({ message: "Recipe not found" });
            res.status(200).json({ message: "Recipe obtained successfully", recipe });
        } catch (error) {
            res.status(500).json({message: "Error obtaining recipe by ID", error});
        }
    },

    async getRecipesByUser(req, res) {
        try {
            const userId = req.params.id;
            const recipes = await Recipe.find({ chefId: userId })
                .populate('ingredients.ingredientId');
            res.status(200).json({ message: "Recipes obtained successfully", recipes });
        }
        catch (error) {
            res.status(500).json({message: "Error obtaining recipes by user", error});
        }
    },



    async getRecipes(req, res) {
        try {
            const recipes = await Recipe.find()
                // .populate('chefId')
                // .populate('ingredients.ingredientId');
            res.status(200).json({ message: "Recipes obtained successfully", recipes });
        } catch (error) {
            res.status(500).json({message: "Error obtaining recipes", error});
        }
    },



    async getRecipesByCriteria(req, res) {
        try {
            
            const filters = req.body;

            const criteria = {};

            if (filters.category && filters.category !== '') criteria.category = filters.category;
            if (filters.tags && filters.tags.length > 0) criteria.tags = { $in: filters.tags };
            if (filters.caloriesMin || filters.caloriesMax) {
                criteria.calories = {};
                if (filters.caloriesMin) criteria.calories.$gte = filters.caloriesMin;
                if (filters.caloriesMax) criteria.calories.$lte = filters.caloriesMax;
            }
            if (filters.ingredients && filters.ingredients.length > 0) {
                criteria['ingredients.ingredientId'] = { $in: filters.ingredients };
    //             const ingredientIds = filters.ingredients.map(id => new mongoose.Types.ObjectId(id));
    // criteria['ingredients.ingredientId'] = { $in: ingredientIds };
            }
            if (filters.preparationTimeMax) {
                criteria.preparationTime = { $lte: filters.preparationTimeMax };
            }

            const recipes = await Recipe.find(criteria);
            res.status(200).json({ message: "Recipes obtained successfully", recipes });

        } catch (error) {
            console.log(error)
            res.status(500).json({message: "Error obtaining recipes", error});
        }
    },


    async getRecipeByChef(req, res) {
        try {
            const chefId = req.params.id;
            const recipes = await Recipe.find({ chefId: chefId });
            res.status(200).json({ message: "Recipes obtained successfully", recipes });
        } catch (error) {
            res.status(500).json({message: "Error obtaining recipes", error});
        }
    },




    async updateRecipe(req, res) {
        try {
            const id = req.params.id;
            const recipeData = req.body;

            const recipe = await Recipe.findByIdAndUpdate(id, recipeData, { new: true });
            res.status(200).json({ message: "Recipe updated successfully", recipe });
        } catch (error) {
            res.status(500).json({message: "Error updating recipe", error});
        }
    }
};

module.exports = recipeController;
