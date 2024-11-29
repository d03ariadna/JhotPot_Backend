const User = require('../models/User');
// const userValidator = require('../validators/userValidator');
const jwt = require('jsonwebtoken');

const userController = {

    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).json({ message:"Users fetched successfully", users});
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Error fetching users", error });
        }
    },

    async getChefs(req, res) {
        
        const userId = req.params.id;
        try {
            // Buscar todos los usuarios excepto el que tenga el ID especificado en los params
            const chefs = await User.find({ _id: { $ne: userId } }) // Excluir el usuario con este ID
                .select('name location profilePictureUrl followers views reviews')
                .populate({
                    path: 'reviews.user',
                    select: 'name profilePictureUrl', // Ajustar campos en las reviews
                });

            res.status(200).json({ message: "Chefs fetched successfully", chefs });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching chefs", error });
        }
    },


    async register(req, res) {
        try {
            const { name, email, password, location, profilePictureUrl } = req.body;
            // const { name, email, password, profilePictureUrl, location, followers, views } = req.body;
            
            // Validar contraseña
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
            if (!passwordRegex.test(password)) {
                return res.status(400).json({
                    message: "Password must be at least 8 characters long, and include letters, numbers, and special characters"
                });
            }

            let user = await User.findOne({ email });
            if (user) return res.status(400).json({ message: "User already exists" });

            user = new User({ name, email, password, profilePictureUrl, location, reviews: [], savedRecipes: [], sharedRecipes: []  });
            await user.save();

            const uEmail = user.email;
            const uPassword = user.password;
                
            res.status(201).json({
                message: "User created successfully",
                user: { email: uEmail, password: uPassword }
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Error creating user", error });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user || !(user.password === password)) {
                return res.status(400).json({ message: "Invalid Credentials" });
            }

            // const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            // console.log(token);
            const token = user._id;

            res.status(200).json({ message: "Log in successfully", token });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error logining in", error });
        }
    },

    async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const updates = req.body;

            const user = await User.findByIdAndUpdate(userId, updates, { new: true });

            const filterUser = { name: user.name, email: user.email, profilePictureUrl: user.profilePictureUrl, location: user.location, followers: user.followers, views: user.views, reviews: user.reviews };
            res.status(200).json({ message: "User updated successfully", user: filterUser });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Error updating user", error });
        }
    },


    //Get user Data
    async getUserData(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId)
                .select('name email profilePictureUrl location followers views reviews')
                .populate('reviews.user', 'name profilePictureUrl');
            
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ message: "User data fetched successfully", user });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Error fetching user data", error });
        }
    },

    async addReview (req, res) {
        try {
            const userId = req.params.id; // ID del usuario que recibirá la reseña
            const { reviewerId, content, rating, emoji } = req.body; // Datos de la reseña

            // Validar campos necesarios
            if (!reviewerId || !content || !rating ) {
                return res.status(400).json({ message: "All fields are required" });
            }

            // Crear una nueva reseña
            const newReview = {
                user: reviewerId,
                content,
                rating,
                emoji,
            };

            // Actualizar al usuario añadiendo la nueva reseña
            const user = await User.findByIdAndUpdate(
                userId,
                { $push: { reviews: newReview } }, // Agregar al array de reseñas
                { new: true } // Devolver el documento actualizado
            );

            const chefs = await User.find({ _id: { $ne: reviewerId } }) // Excluir el usuario con este ID
                .select('name location profilePictureUrl followers views reviews')
                .populate({
                    path: 'reviews.user',
                    select: 'name profilePictureUrl', // Ajustar campos en las reviews
                });
            
            res.status(200).json({ message: "Review added successfully", chefs });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Error adding review", error });
        }
    },


    // Saved Recipes
    async getSavedRecipes(req, res) {
        try {
            const userId = req.params.id; // ID del usuario
            const user = await User.findById(userId).populate('savedRecipes');

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ message: "Saved recipes fetched successfully", savedRecipes: user.savedRecipes });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Error fetching saved recipes", error });
        }
    },

    async toggleSavedRecipe(req, res) {
        try {
            const userId = req.params.id; // ID del usuario
            const { recipeId } = req.body; // ID de la receta a guardar o desguardar

            // Validar que el ID de la receta esté presente
            if (!recipeId) {
                return res.status(400).json({ message: "Recipe ID is required" });
            }

            // Buscar al usuario
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Verificar si la receta ya está guardada
            const isSaved = user.savedRecipes.includes(recipeId);

            if (isSaved) {
                // Si ya está guardada, eliminarla
                user.savedRecipes.pull(recipeId);
            } else {
                // Si no está guardada, agregarla
                user.savedRecipes.push(recipeId);
            }

            // Guardar los cambios
            await user.save();

            const updatedUser = await User.findById(userId).populate("savedRecipes");

            res.status(200).json({
                message: isSaved
                    ? "Recipe removed from saved recipes"
                    : "Recipe added to saved recipes",
                savedRecipes: updatedUser.savedRecipes // Lista actualizada de recetas guardadas
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Error updating saved recipes", error });
        }
    },


    // Shared Recipes
    async getSharedRecipes(req, res) {
        try {
            const userId = req.params.id; // ID del usuario
            const user = await User.findById(userId).populate('sharedRecipes');

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ message: "Shared recipes fetched successfully", sharedRecipes: user.sharedRecipes });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Error fetching shared recipes", error });
        }
    },

    async updateSharedRecipes(req, res) {
        try {
            const userId = req.params.id; // ID del usuario
            const { recipeId } = req.body; // ID de la receta a guardar o desguardar

            // console.log(userId, recipeId)
            // Validar que el ID de la receta esté presente
            if (!recipeId) {
                return res.status(400).json({ message: "Recipe ID is required" });
            }

            // Buscar al usuario
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Verificar si la receta ya está guardada
            const isShared = user.sharedRecipes.includes(recipeId);

            if (!isShared) {
                // Si no está guardada, agregarla
                user.sharedRecipes.push(recipeId);
            }

            // Guardar los cambios
            await user.save();

            const updatedUser = await User.findById(userId).populate("sharedRecipes");

            res.status(200).json({
                message: "Recipe added to shared recipes",
                sharedRecipes: updatedUser.sharedRecipes // Lista actualizada de recetas compartidas
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Error updating shared recipes", error });
        }
    },


    async updateFollowers (req, res) {
        try {
            const { userId } = req.params; // ID del usuario al que se le modifica el número de seguidores
            const { action } = req.body; // Acción: 'add' para sumar, 'remove' para restar

            // Validar acción
            if (!['add', 'remove'].includes(action)) {
                return res.status(400).json({ message: "Invalid action. Use 'add' or 'remove'." });
            }

            // Buscar usuario
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Actualizar seguidores
            if (action === 'add') {
                user.followers += 1;
            } else if (action === 'remove') {
                user.followers = Math.max(0, user.followers - 1); // Asegurarse de que no sea negativo
            }

            // Guardar cambios
            await user.save();

            res.status(200).json({
                message: `Follower count ${action === 'add' ? 'increased' : 'decreased'} successfully.`,
                followers: user.followers
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating followers", error });
        }
    },


    async validateKey(req, res) {
        try {
            const { email, secretKey } = req.body;
            // console.log(email, secretKey)

            // Verificar que el email y la palabra secreta no estén vacíos
            if (!email || !secretKey) {
            return res.status(400).json({ message: 'Email and secret word are required.' });
            }

            // Buscar al usuario por email
            const user = await User.findOne({ email });

            if (!user) {
            return res.status(404).json({ message: 'User not found.' });
            }

            // Comparar la palabra secreta con la locación del usuario
            if (user.location !== secretKey) {
            return res.status(401).json({ message: 'Incorrect secret word.' });
            }

            const token = user._id;

            res.status(200).json({ message: "Successfull validation", token });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error validating key", error });
        }
    }


}

module.exports = userController;