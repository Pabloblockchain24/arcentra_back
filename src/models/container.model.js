import mongoose from "mongoose";

const containerSchema = new mongoose.Schema({
unidad: { type: String, required: true },
    referencia: String,

  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },

  nave: String,
  eta: Date,
  fechaDescarga: Date,

  tipoContenedor: String,
  diasLibres: Number,

  operacion: {
    type: String,
    enum: ["full", "desconsolidado"]
  },

  producto: String,
  almacenDestino: String,
  tarifa: Number,

  lugarDevolucion: String,
  deposito: String

}, {
  timestamps: true
});

export default mongoose.model("Container", containerSchema);