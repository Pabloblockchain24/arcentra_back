import express, { Router } from "express";
const router = express.Router();

import { getContainerDetail, getContainers, createContainer } from "../controllers/container.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

router.get("/:id", protect, getContainerDetail)
router.get("/", protect,getContainers)
router.post("/create", createContainer)

export default router;