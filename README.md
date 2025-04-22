# JhotPot API

## Overview
JhotPot API is a backend service designed to manage meals, ingredients, recipes, users, and smart devices. It provides a structured way to interact with these entities through RESTful API endpoints, enabling seamless integration with a frontend application.

## Features
- **User Management**: Handle user data, including their associated ingredients and preferences.
- **Recipe Management**: Create, read, update, and delete recipes.
- **Ingredient Management**: Manage ingredients and their details.
- **Smart Device Integration**: Support for managing smart kitchen devices.
- **Database Integration**: Efficiently store and retrieve data for a smooth user experience.

## Project Structure
### Root Files
- **index.js**: The main entry point of the application, responsible for initializing the server and setting up routes.
- **package.json**: Contains project metadata and dependencies.
- **scriptIng.js**: A script to preload ingredients into the database by fetching data from The Meal DB API.

### Folders

#### 📁 controllers

Contains the business logic for handling requests and responses for various entities:

- **chefController.js**: Manages operations related to chefs.
- **ingredientController.js**: Handles ingredient-related operations.
- **recipeController.js**: Manages recipe-related operations.
- **smartDeviceController.js**: Handles operations for smart kitchen devices.
- **userController.js**: Manages user-related operations.
- **userIngredientController.js**: Handles operations related to user-specific ingredients.

#### 📁 db

- **db.js**: Contains the database connection logic for MongoDB.


#### 📁 models

Defines the data structure for various entities using Mongoose schemas:

- **Chef.js**: Schema for chef-related data.
- **Ingredient.js**: Schema for ingredient-related data.
- **Recipe.js**: Schema for recipe-related data.
- **SmartDevice.js**: Schema for smart device-related data.
- **User.js**: Schema for user-related data.
- **UserIngredient.js**: Schema for user-specific ingredient data.

#### 📁 routes

Defines the API endpoints for interacting with the application:

## Technologies Used
- **Backend Framework**: Node.js with Express.js
- **Database**: MongoDB and Mongoose
- **Hashing passwords**: bcrypt

## API Endpoints

### Users
- **GET** `/api/users`: Retrieve all users
- **POST** `/api/users`: Create a new user
- **PUT** `/api/users/:id`: Update user details
- **DELETE** `/api/users/:id`: Delete a user

### Recipes
- **GET** `/api/recipes`: Retrieve all recipes
- **POST** `/api/recipes`: Add a new recipe
- **PUT** `/api/recipes/:id`: Update a recipe
- **DELETE** `/api/recipes/:id`: Delete a recipe

### Ingredients
- **GET** `/api/ingredients`: Retrieve all ingredients
- **POST** `/api/ingredients`: Add a new ingredient
- **PUT** `/api/ingredients/:id`: Update an ingredient
- **DELETE** `/api/ingredients/:id`: Delete an ingredient

### Smart Devices
- **GET** `/api/smart-devices`: Retrieve all smart devices
- **POST** `/api/smart-devices`: Add a new smart device
- **PUT** `/api/smart-devices/:id`: Update a smart device
- **DELETE** `/api/smart-devices/:id`: Delete a smart device

## License
This project is licensed under the MIT License. See the LICENSE file for details.