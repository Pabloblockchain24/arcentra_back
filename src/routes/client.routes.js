import express from "express";
const router = express.Router();

import { createClient } from "../controllers/client.controller.js";


router.post("/create", createClient)

export default router;