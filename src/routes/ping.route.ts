import { Router } from "express";
import PingController from "../controllers/ping.controller.js";

export default function ping(): Router {
	const router = Router();

	router.get("/", PingController.pong);

	return router;
}
