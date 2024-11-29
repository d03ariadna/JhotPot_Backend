const mongoose = require('mongoose');


const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    preparationTime: { type: Number, required: true },
    calories: { type: Number },
    servings: { type: Number },
    tags: [{ type: String }],
    description: { type: String },
    ingredients: [
        {
            ingredientId: { type: String, required: true },
            quantity: { type: String, required: true },
            unit: { type: String, required: true }
        }
    ],
    steps: [{ type: String, required: true }],
    images: [{ type: String }],
    category: { type: String },
    chefId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

recipeSchema.path('ingredients').schema.set('_id', false);

recipeSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id
    return object;
});

module.exports = mongoose.model('Recipe', recipeSchema);
