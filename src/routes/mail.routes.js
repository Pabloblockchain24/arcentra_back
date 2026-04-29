import express from "express";
const router = express.Router();

import { sendMail } from "../controllers/mail.controller.js";


router.post("/", sendMail)

export default router;