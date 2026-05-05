import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String,

    // 🔥 ESTE ES EL IMPORTANTE
clienteId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Client",
  required: function () {
    return this.tipoUsuario === "cliente";
  },
  index: true
},
    nombre: String,
    apellido: String,

    tipoUsuario: {
      type: String,
      enum: ["admin", "cliente", "colaborador", "chofer", "operador"],
      default: "cliente",
      required: true,
    },

    lastConnection: {
      type: Date,
      default: null,
    },

    connections: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        ip: String,
        userAgent: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);