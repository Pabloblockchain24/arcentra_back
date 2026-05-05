// lib/db.js
import mongoose from "mongoose";
import config from "./config/config.js";

// Guardamos el estado de la conexión
let isConnected = null;

export const connectDB = async () => {
  if (isConnected) {
    // Ya está conectado → reutilizamos
    return;
  }

  try {
    const db = await mongoose.connect(config.MONGO_URL)
    isConnected = db.connections[0].readyState;
    console.log("✅ MongoDB conectado:", isConnected === 1 ? "READY" : "NOT READY");
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error);
    throw error;
  }
};
