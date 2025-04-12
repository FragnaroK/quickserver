import { Router } from "express";
import HealthController from "../controllers/health.controller.js";

export default function health(): Router {
	const router = Router();

	router.get("/", HealthController.getHealth);

	return router;
}
