const Ingredient = require('../models/Ingredient');

const ingredientController = {

    async getIngredients(req, res) {
        try {
            const ingredients = await Ingredient.find().select('name img');

            // Transformar la lista en un objeto con los IDs como claves
            const formattedIngredients = ingredients.reduce((acc, ingredient) => {
                acc[ingredient.id] = {
                    name: ingredient.name,
                    img: ingredient.img,
                };
                return acc;
            }, {});

            res.status(200).json(formattedIngredients);
        } catch (error) {
            res.status(500).json({ message: "Error fetching ingredients", error });
        }
    },



    async getIdByName(req, res) {
        try {
            const name = req.params.name;
            const ingredient = await Ingredient.findOne({ name: name });
            res.status(200).json(ingredient);
        } catch (error) {
            res.status(500).json({ message: "Error fetching ingredient", error });
        }
    }
};

module.exports = ingredientController;