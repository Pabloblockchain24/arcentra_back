// src/db.js
import mongoose from "mongoose";

// ⚠️ cache global para evitar múltiples conexiones en serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  // Si ya está conectado → reutiliza
  if (cached.conn) {
    return cached.conn;
  }

  // Si no hay promesa de conexión → créala
  if (!cached.promise) {
    const MONGO_URL = process.env.MONGO_URL;

    if (!MONGO_URL) {
      console.error("❌ MONGO_URL no está definida en variables de entorno");
      throw new Error("MONGO_URL is missing");
    }

    console.log("🔄 Conectando a MongoDB...");

    cached.promise = mongoose.connect(MONGO_URL, {
      bufferCommands: false,
    })
    .then((mongooseInstance) => {
      console.log("✅ MongoDB conectado");
      return mongooseInstance;
    })
    .catch((err) => {
      console.error("❌ Error al conectar con MongoDB:", err.message);
      cached.promise = null; // 👈 permite reintentar
      throw err;
    });
  }

  // Espera la conexión
  cached.conn = await cached.promise;
  return cached.conn;
};