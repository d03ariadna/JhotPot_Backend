// models/UserIngredient.js
const mongoose = require('mongoose');

const userIngredientSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ingredientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient', // Asumiendo que hay una colección "Ingredient" con todos los ingredientes posibles
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: () => {
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
        }
    },
    expirationDate: {
        type: Date // `timestamp` en MongoDB es manejado como `Date` en Mongoose
    },
    deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SmartDevice'
    }
});

userIngredientSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id
    return object;
})

module.exports = mongoose.model('UserIngredient', userIngredientSchema);
