import { AsyncControllerFunction } from "@/types/express/controllers.js";

// TODO: Implement a proper health check with database and service checks and UI
export default class HealthController {
	static readonly getHealth: AsyncControllerFunction = async (req, res): Promise<void> => {
		res.ok({ status: "ok" });
	};
}
