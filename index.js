
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/db');

const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRouter');
const userIngredientRoutes = require('./routes/userIngredientRouter');
const smartDeviceRoutes = require('./routes/smartDeviceRouter');
const ingredientRoutes = require('./routes/ingredientRouter');


const app = express();
app.use(express.json());

app.use(cors());


connectDB();

app.get('/', (req, res) => {
    res.send('Welcome to the Recipe API');
});
app.use('/users', userRoutes);
app.use('/recipes', recipeRoutes);
app.use('/userIngredients', userIngredientRoutes);
app.use('/smartDevices', smartDeviceRoutes);
app.use('/ingredients', ingredientRoutes);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});