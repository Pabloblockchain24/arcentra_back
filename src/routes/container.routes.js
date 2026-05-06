import express, { Router } from "express";
const router = express.Router();

import { getContainerDetail, getContainers, createContainer, updateContainer, deleteContainer } from "../controllers/container.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

router.get("/:id", protect, getContainerDetail)
router.get("/", protect,getContainers)
router.post("/create", createContainer)
router.put("/update/:id", protect, updateContainer)
router.delete("/delete/:id", protect, deleteContainer)

router.get("/search", protect, searchContainers);

export default router;