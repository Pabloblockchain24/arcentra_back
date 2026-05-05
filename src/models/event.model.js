import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  containerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Container",
    required: true,
    index: true
  },

  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
    index: true
  },

  tipo: {
    type: String,
    enum: ["retiro_puerto", "entrega_cd", "devolucion_vacio"],
    required: true,
    index: true
  },

  fecha: {
    type: Date,
    required: true,
    index: true
  },

  hora: String,
  proveedor: String,
  chofer: String,
  patente: String,

  estado: {
    type: String,
    enum: ["programado", "completado", "fallido"],
    default: "programado",
    index: true
  },

  observacion: String

}, {
  timestamps: true
});

export default mongoose.model("Event", eventSchema);