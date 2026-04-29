import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: false
    },
    descripcion : {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Lead = mongoose.model("Lead", leadSchema)
export default Lead;
