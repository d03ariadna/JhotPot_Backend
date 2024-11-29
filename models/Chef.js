const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    profilePictureUrl: { type: String },
    location: { type: String },
    followers: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    reviews: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, review: String, rating: Number }],
});

chefSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id
    return object;
})

module.exports = mongoose.model('Chef', chefSchema);
