import express from "express";
const router = express.Router();
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  reactivateClient
} from "../controllers/client.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

router.use(protect);
router.post("/create", createClient);
router.get("/", getClients);
router.get("/:id", getClientById);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);
router.patch("/:id/reactivate", reactivateClient);

export default router;