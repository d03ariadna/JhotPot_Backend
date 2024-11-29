const mongoose = require('mongoose');
const axios = require('axios');

// Conectar a MongoDB
mongoose.connect('mongodb+srv://MERN_USER:KoiVd0838b9Gr2BT@calendardb.jtggqan.mongodb.net/jhotPot_app');

// Definir el esquema de ingredientes
const ingredientSchema = new mongoose.Schema({
//   id: String,
  name: String,
  img: String,
});

ingredientSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id
    return object;
})

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

async function preloadIngredients() {
  try {
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
    const ingredients = response.data.meals;

    // Formatear los ingredientes de la primera API
    const formattedIngredients = ingredients.map((ingredient) => ({
    //   id: ingredient.idIngredient,
      name: ingredient.strIngredient,
      img: `https://www.themealdb.com/images/ingredients/${ingredient.strIngredient}.png`
    }));

    // Obtener ingredientes de la segunda API
    const drinksResponse = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list');
    const drinksIng = drinksResponse.data.drinks;

    // Formatear los ingredientes de la segunda API con IDs únicos
    const formattedDrinksIngredients = drinksIng.map((drink, index) => ({
    //   id: (index + 609).toString(),
      name: drink.strIngredient1,
      img: `https://www.themealdb.com/images/ingredients/${drink.strIngredient1}.png`
    }));

    // Crear un Set para almacenar nombres únicos y un array para los ingredientes sin duplicados
    const uniqueNames = new Set();
    const allIngredients = [];

    // Añadir ingredientes de la primera API, asegurando que no haya duplicados
    formattedIngredients.forEach((ingredient) => {
      if (!uniqueNames.has(ingredient.name)) {
        uniqueNames.add(ingredient.name);
        allIngredients.push(ingredient);
      }
    });

    // Añadir ingredientes de la segunda API, asegurando que no haya duplicados
    formattedDrinksIngredients.forEach((ingredient) => {
      if (!uniqueNames.has(ingredient.name)) {
        uniqueNames.add(ingredient.name);
        allIngredients.push(ingredient);
      }
    });

    // Guardar los ingredientes en MongoDB
    await Ingredient.insertMany(allIngredients);
    console.log('Ingredientes precargados exitosamente en MongoDB');
  } catch (error) {
    console.error('Error al precargar ingredientes:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Ejecutar el script de precarga
preloadIngredients();
