import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    empresa: String,
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

const userModel = mongoose.model("User", userSchema)

export default userModel