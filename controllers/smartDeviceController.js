const SmartDevice = require('../models/SmartDevice');
const UserIngredient = require('../models/UserIngredient');

const smartDeviceController = {

    async createSmartDevice(req, res) {
        try {
        const { name, qrCode, userId, ingredients = [], img } = req.body;

        // Verificar si ya existe un dispositivo con el mismo qrCode
        const existingDevice = await SmartDevice.findOne({ qrCode });
        if (existingDevice) {
            return res.status(400).json({ message: 'A Smart Device with this QR Code already exists.' });
        }

        // Crear un nuevo dispositivo
        const newDevice = new SmartDevice({ name, qrCode, userId, ingredients, img });
        const savedDevice = await newDevice.save();

            console.log(savedDevice)
        res.status(201).json(savedDevice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating Smart Device", error });
    }
    },

    async getSmartDevicesByUser(req, res) {
        try {
            const userId = req.params.userId;

            // Buscar los dispositivos inteligentes del usuario y poblar los ingredientes
            const smartDevices = await SmartDevice.find({ userId }).populate({
                path: 'ingredients', // Poblar UserIngredient
            });

            // Transformar los datos para cambiar `_id` a `id` en los ingredientes
            const transformedDevices = smartDevices.map(device => ({
                ...device.toObject(), // Convertir el documento Mongoose a un objeto JS
                ingredients: device.ingredients.map(ingredient => ({
                    ...ingredient.toObject(), // Convertir cada ingrediente a objeto
                    id: ingredient._id, // Asignar el valor de `_id` a `id`
                    _id: undefined, // Eliminar `_id`
                })),
            }));

            res.status(200).json(transformedDevices);
        } catch (error) {
            console.error("Error fetching Smart Devices:", error);
            res.status(500).json({ message: "Error fetching Smart Devices", error });
        }
    },


    async getIngredientsInSmartDevice(req, res) {
        try {
            const deviceId = req.params.deviceId;

        const smartDevice = await SmartDevice.findById(deviceId).populate({
            path: 'ingredients', // Poblar UserIngredient
        });

        if (!smartDevice) {
            return res.status(404).json({ message: "Smart Device not found" });
        }

        // Retornar los ingredientes poblados
        // res.status(200).json(smartDevice.ingredients);
            
            res.status(200).json(smartDevice.ingredients);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error fetching ingredients in Smart Device", error });
        }
    },

    async updateSmartDevice(req, res) {
        try {
            const id = req.params.id;
            const updatedSmartDevice = await SmartDevice.findByIdAndUpdate(id, req.body);
            res.status(200).json({ message: "Smart Device updated successfully", updatedSmartDevice });
        } catch (error) {
            res.status(500).json({ message: "Error updating Smart Device", error });
        }
    },

    // async addUserIngredient(req, res) {
    //     try {
    //         const id = req.params.id;
    //         const smartDevice = await SmartDevice.findById(id);
    //         smartDevice.ingredients.push(req.body);
    //         await smartDevice.save();
    //         res.status(200).json({ message: "Ingredient added to Smart Device", smartDevice });
    //     } catch (error) {
    //         res.status(500).json({ message: "Error adding ingredient to Smart Device", error });
    //     }
    // },


    async deleteSmartDevice(req, res) {
        try {
            const id = req.params.id;
            console.log(id)

            const deletedDevice = await SmartDevice.findByIdAndDelete(id);

            if (!deletedDevice) {
                return res.status(404).json({ message: "Smart Device not found" });
            }

            await UserIngredient.updateMany(
                { deviceId: id }, // Condición para buscar ingredientes con el deviceId
                { $set: { deviceId: null } } // Establecer el campo `deviceId` a null
            );
            
            res.status(200).json({ message: "Smart Device and related ingredients updated successfully" });
        } catch (error) {
            console.error("Error deleting Smart Device:", error);
            res.status(500).json({ message: "Error deleting Smart Device", error });
        }
    }
};


module.exports = smartDeviceController;