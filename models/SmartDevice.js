const mongoose = require('mongoose');

const smartDeviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    qrCode: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ingredients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserIngredient'
    }],
    img: {
        type: String
    },
});

// smartDeviceSchema.method('toJSON', function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id
//     return object;
// });

module.exports = mongoose.model('SmartDevice', smartDeviceSchema);