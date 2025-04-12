import { AsyncControllerFunction } from "@/types/express/controllers.js";

export default class PingController {
	static readonly pong: AsyncControllerFunction = async (req, res): Promise<void> => {
		res.ok({ status: "pong" });
	};
}
