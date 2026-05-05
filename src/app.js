import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import formRoutes from "./routes/form.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

const allowedOrigins = [
    'https://arcentra-web.vercel.app',
    'https://arcentra-portal.vercel.app'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // 👇 en vez de error, responde false
        return callback(null, false);
    },
    credentials: true
};

app.use(cors({ origin: true, credentials: true }));


// Rutas
app.use("/api/send-mail", formRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/test", (req, res) => {
  res.json({ ok: true });
});


export default app; 
