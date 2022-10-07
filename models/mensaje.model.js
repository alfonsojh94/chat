const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mensajeShema = new Schema({
    nombre: String,
    mensaje: String,
    socketId: String
}, { timestamps: true });

module.exports = mongoose.model('mensaje', mensajeShema);
