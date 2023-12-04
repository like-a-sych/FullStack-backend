import { response } from "express";
import { PostModel } from "../models/Post.js";

const getAll = async (request, response) => {
	try {
		const posts = await PostModel.find().populate("user").exec();

		response.json(posts);
	} catch (error) {
		response.status(500).json({
			message: "Не удалось получить статьи",
		});
	}
};

const getOne = async (request, response) => {
	try {
		const postId = request.params.id;

		const document = await PostModel.findOneAndUpdate(
			{ _id: postId },
			{ $inc: { viewsCount: 1 } },
			{ new: true }
		);

		if (!document) {
			return response.status(404).json({
				message: "Статья не найдена",
			});
		}

		response.json(document);
	} catch (error) {
		console.error(error);
		response.status(500).json({
			message: "Не удалось получить статью",
		});
	}
};

const remove = async (request, response) => {
	try {
		const postId = request.params.id;

		const document = await PostModel.findOneAndDelete({ _id: postId });

		if (!document) {
			return response.status(404).json({
				message: "Статья не найдена",
			});
		}

		response.json({
			success: true,
		});
	} catch (error) {
		console.error(error);
		response.status(500).json({
			message: "Статья не найдена",
		});
	}
};

const create = async (request, response) => {
	try {
		const document = new PostModel({
			title: request.body.title,
			text: request.body.text,
			imageUrl: request.body.imageUrl,
			tags: request.body.tags,
			user: request.userId,
		});
		const post = await document.save();

		response.json(post);
	} catch (error) {
		response.status(500).json({
			message: "Не удалось создать статью",
		});
	}
};

const update = async (request, response) => {
	try {
		const postId = request.params.id;
		await PostModel.updateOne(
			{
				_id: postId,
			},
			{
				title: request.body.title,
				text: request.body.text,
				imageUrl: request.body.imageUrl,
				user: request.userId,
				tags: request.body.tags,
			}
		);
		response.json({
			message: "Статья обновлена",
		});
	} catch (error) {
		console.error(error);
		response.status(500).json({
			message: "Нельзя редактировать",
		});
	}
};

export { create, getAll, getOne, remove, update };
