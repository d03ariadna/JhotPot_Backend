const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    content: String,
    rating: Number,
    emoji: String,
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    profilePictureUrl: { type: String },
    location: { type: String },
    followers: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    reviews: [reviewSchema],

    savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    sharedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    // availableIngredients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserIngredient' }],
});

// Método para verificar contraseña
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.passwordHash);
};

// Middleware para hashear la contraseña antes de guardarla
userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
    next();
});

userSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id
    return object;
})

module.exports = mongoose.model('User', userSchema);
