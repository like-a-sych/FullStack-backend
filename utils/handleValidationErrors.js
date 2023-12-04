import { validationResult } from "express-validator";

function validationErrors(request, response, next) {
	const errors = validationResult(request);
	if (!errors.isEmpty()) {
		return response.status(400).json(errors.array());
	}
	next();
}

export { validationErrors };
