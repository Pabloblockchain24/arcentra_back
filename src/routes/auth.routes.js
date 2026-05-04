// routes/auth.js
import express from "express";
import {login, logout, register, verifyToken} from "../controllers/auth.controller.js"

const router = express.Router();

router.post("/login", login)
router.post("/logout", logout)
router.post("/register", register)
router.get("/verify", verifyToken)

export default router;
