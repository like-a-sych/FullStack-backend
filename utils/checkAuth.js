import jwt from "jsonwebtoken";

function checkAuth(request, response, next) {
	const token = (request.headers.authorization || "")
		.replace(/Bearer\s?/, "")
		.trim();

	if (token) {
		try {
			const decoded = jwt.verify(token, "secret123");
			request.userId = decoded._id;
			next();
		} catch (error) {
			return response.status(403).json({
				message: "Нет доступа",
			});
		}
	} else {
		return response.status(403).json({
			message: "Нет доступа",
		});
	}
}

export { checkAuth };
