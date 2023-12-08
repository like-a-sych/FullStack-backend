import express from "express";
import compression from "compression";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import {
	loginValidation,
	postCreateValidation,
	registerValidation,
} from "./validations.js";
import { validationErrors, checkAuth } from "./utils/index.js";
import * as Controller from "./controllers/index.js";

mongoose
	.connect("mongodb://localhost:27017/blog")
	.then(() => {
		console.log("DB ok");
	})
	.catch((error) => {
		console.error("DB error", error);
	});

const app = express();
app.use(cors());
app.use(compression());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
	destination: (_, __, callback) => {
		callback(null, "uploads");
	},
	filename: (_, file, callback) => {
		callback(null, file.originalname);
	},
});
const upload = multer({
	storage,
});

const PORT = 4444;
const server = app.listen(PORT, () => {
	console.log(`Server started PORT:${PORT}`);
});
server.on("error", (error) => {
	if (error.syscall !== "listen") {
		throw error;
	}

	switch (error.code) {
		case "EACCES":
			console.error(`Порт ${PORT} требует повышенных привилегий`);
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(`Порт ${PORT} уже используется`);
			process.exit(1);
			break;
		default:
			throw error;
	}
});

app.get("/posts", Controller.getAll);
app.get("/tags", Controller.getLastTags);
app.get("/posts/:id", Controller.getOne);
app.get("/auth/me", checkAuth, Controller.getMe);
app.post(
	"/posts",
	checkAuth,
	postCreateValidation,
	validationErrors,
	Controller.create
);
app.delete("/posts/:id", checkAuth, Controller.remove);
app.patch(
	"/posts/:id",
	checkAuth,
	postCreateValidation,
	validationErrors,
	Controller.update
);
app.post("/upload", checkAuth, upload.single("image"), (request, response) => {
	response.json({
		url: `/uploads/${request.file.originalname}`,
	});
});

app.post("/auth/login", loginValidation, validationErrors, Controller.login);
app.post(
	"/auth/register",
	registerValidation,
	validationErrors,
	Controller.register
);
