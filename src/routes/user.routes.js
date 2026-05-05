import express from "express";
import {getUsers, getUserById, createUser, updateUser, deleteUser} from "../controllers/user.controller.js"
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.get("/",  getUsers)
router.get("/:id",  getUserById)
router.post("/", createUser)
router.put("/:id", updateUser)
router.delete("/:id", deleteUser)

export default router;
