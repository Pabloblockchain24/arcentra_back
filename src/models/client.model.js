import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },

  rut: {
    type: String,
    unique: true,
    sparse: true, // permite null pero evita duplicados
    trim: true
  },

  email: {
    type: String,
    lowercase: true,
    trim: true
  },

  telefono: {
    type: String,
    trim: true
  },

  direccion: {
    type: String,
    trim: true
  },

  activo: {
    type: Boolean,
    default: true,
    index: true
  }

}, {
  timestamps: true
});

export default mongoose.model("Client", clientSchema);