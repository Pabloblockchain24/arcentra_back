import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import formRoutes from "./routes/form.routes.js";
import authRoutes from "./routes/auth.routes.js";
import ContainerRoutes from "./routes/container.routes.js";
import ClientRoutes from "./routes/client.routes.js";
import userRoutes from "./routes/user.routes.js";
import eventRoutes from "./routes/event.routes.js";

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

const allowedOrigins = [
    '*',
    'http://localhost:5173',
    'https://arcentra-web.vercel.app',
    'https://arcentra-portal.vercel.app'
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
app.use("/api/send-mail", formRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/containers", ContainerRoutes);
app.use("/api/clients", ClientRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);

export default app; 
