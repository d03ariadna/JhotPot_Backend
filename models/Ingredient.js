const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ingredientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
});

ingredientSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id
    return object;
})

module.exports = mongoose.model('Ingredient', ingredientSchema);

