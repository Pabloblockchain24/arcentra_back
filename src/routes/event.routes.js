import express from "express";
import {createEvent, getEvents, getEventById, updateEvent, deleteEvent } from "../controllers/event.controller.js"
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.get("/",  getEvents)
router.get("/:id",  getEventById)
router.post("/", createEvent)
router.put("/:id", updateEvent)
router.delete("/:id", deleteEvent)

export default router;
