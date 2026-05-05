import serverless from "serverless-http";
import app from "./src/app.js";
import { connectDB } from "./src/db.js";

// conectar DB (esto sí se puede)
connectDB();

export default serverless(app);