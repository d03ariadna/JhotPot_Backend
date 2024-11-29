const Chef = require('../models/Chef');

const chefController = {

    async createChef(req, res) {
        try {
            const chef = new Chef(req.body);
            await chef.save();
            res.status(201).json({ message: "Chef creado exitosamente", chef });
        } catch (error) {
            res.status(500).json({ message: "Error al crear el chef", error });
        }
    },

    async getChef(req, res) {
        try {
            const userId = req.params.userId;
            const chef = await Chef.findOne({ userId: userId });
            res.status(200).json(chef);
        } catch (error) {
            res.status(500).json({ message: "Error fetching chef", error });
        }
    },

    async getAllChefs(req, res) {
        try {
            const chefs = await Chef.find();
            res.status(200).json(chefs);
        } catch (error) {
            res.status(500).json({ message: "Error fetching chefs", error });
        }
    }
    ,

    async updateChef(req, res) {
        try {
            const id = req.params.id;
            const updatedChef = await Chef.findByIdAndUpdate(id, req.body, { new: true });
            res.status(200).json({ message: "Chef actualizado exitosamente", updatedChef });
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar el chef", error });
        }
    },

    async deleteChef(req, res) {
        try {
            const id = req.params.id;
            await Chef.findByIdAndDelete(id);
            res.status(200).json({ message: "Chef eliminado exitosamente" });
        } catch (error) {
            res.status(500).json({ message: "Error al eliminar el chef", error });
        }
    }
};

module.exports = chefController;