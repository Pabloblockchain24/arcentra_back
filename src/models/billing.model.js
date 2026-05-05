import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({
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
    enum: ["cliente", "proveedor_viaje", "proveedor_vacio", "depot"],
    required: true,
    index: true
  },

  numeroFactura: {
    type: String,
    trim: true,
    index: true
  },

  fechaFactura: {
    type: Date,
    index: true
  },

  monto: {
    type: Number,
    required: true
  },

  estado: {
    type: String,
    enum: ["pendiente", "pagado"],
    default: "pendiente",
    index: true
  },

  descripcion: String

}, {
  timestamps: true
});

export default mongoose.model("Billing", billingSchema);