import serverless from "serverless-http";
import app from "../src/app.js";
import { connectDB } from "../src/db.js";

// ⚠️ importante: manejar conexión solo una vez
let isConnected = false;

async function connect() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
}

export default async function handler(req, res) {
  await connect();
  return serverless(app)(req, res);
}