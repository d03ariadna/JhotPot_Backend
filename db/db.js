// db.js
const mongoose = require('mongoose');
require('dotenv').config();


async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conected to DB');
    } catch (error) {
        console.log('Error connecting to DB: ', error);
    }

}


module.exports = connectDB;
