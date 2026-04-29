import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import mailRoutes from "./routes/mail.routes.js";

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

const allowedOrigins = [
    '*',
    'http://localhost:4321',
    'https://arcentra-web.vercel.app'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true
};
app.use(cors(corsOptions));

// Rutas
app.use("/api/send-mail", mailRoutes);

export default app; 
