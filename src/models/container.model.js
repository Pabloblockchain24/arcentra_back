import mongoose from "mongoose";

const containerSchema = new mongoose.Schema({
unidad: { type: String, required: true },
    referencia: { type: String, required: true },

  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },

  nave:  { type: String, required: true },
  eta: { type: Date, required: true },
  fechaDescarga: Date,

  tipoContenedor: { type: String, required: true },
  diasLibres: { type: Number, required: true },

  operacion: {
    type: String,
    enum: ["full", "desconsolidado"]
  },

  producto: String,
  almacenDestino: String,
  tarifa: Number,

  lugarDevolucion: String,
  deposito: String,
  guiaTransporte: String

}, {
  timestamps: true
});

export default mongoose.model("Container", containerSchema);