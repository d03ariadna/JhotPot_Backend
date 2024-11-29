// controllers/userIngredientController.js
const UserIngredient = require('../models/UserIngredient');
const SmartDevice = require('../models/SmartDevice');

const userIngredientController = {
    async createUserIngredient(req, res) {
        try {
            // Buscar el dispositivo asociado al deviceId
            const device = req.body.deviceId
                ? await SmartDevice.findById(req.body.deviceId)
                : null;

            // Si el dispositivo no existe, establecer deviceId como null
            if (!device) {
                req.body.deviceId = null;
            }

            // Crear el nuevo ingrediente del usuario
            const userIngredient = new UserIngredient(req.body);
            await userIngredient.save();

            // Si el dispositivo existe, agregar el ingrediente al dispositivo
            if (device) {
                device.ingredients.push(userIngredient);
                await device.save();
            }

            res.status(201).json({
                message: "Ingrediente de usuario creado exitosamente",
                userIngredient,
            });
        } catch (error) {
            console.error("Error al crear el ingrediente de usuario:", error);
            res.status(500).json({ message: "Error al crear el ingrediente de usuario", error });
        }
    },

    //Get user ingredients and populate the ingredient field
    async getUserIngredients(req, res) {
        try {
            const userId = req.params.userId;
            const userIngredients = await UserIngredient.find({ userId: userId });
            res.status(200).json(userIngredients);
        } catch (error) {
            res.status(500).json({ message: "Error fetching user ingredients", error });
        }
    },

    async updateUserIngredient(req, res) {
        try {
            const id = req.params.id;
            const updatedUserIngredient = await UserIngredient.findByIdAndUpdate(id, req.body, { new: true });
            res.status(200).json({ message: "User Ingredient updated successfully", updatedUserIngredient });
        } catch (error) {
            res.status(500).json({ message: "Error updating User Ingredient", error });
        }
    },

    async deleteUserIngredient(req, res) {
        try {
            const id = req.params.id;

            // Buscar y eliminar el UserIngredient
            const deletedIngredient = await UserIngredient.findByIdAndDelete(id);

            if (!deletedIngredient) {
                return res.status(404).json({ message: "User Ingredient not found" });
            }

            // Buscar dispositivos que contengan este ingrediente
            const devices = await SmartDevice.find({ ingredients: id });

            // Remover el ingrediente de cada dispositivo
            await Promise.all(
                devices.map(async (device) => {
                    device.ingredients = device.ingredients.filter(
                        ingredientId => ingredientId.toString() !== id
                    );
                    await device.save();
                })
            );

            res.status(200).json({
                message: "User Ingredient deleted successfully and removed from devices",
            });
        } catch (error) {
            console.error("Error deleting User Ingredient:", error);
            res.status(500).json({ message: "Error deleting User Ingredient", error });
        }
    }

};

module.exports = userIngredientController;
