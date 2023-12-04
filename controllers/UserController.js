import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User.js";

const register = async (request, response) => {
	try {
		const password = request.body.password;
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const document = new UserModel({
			email: request.body.email,
			fullName: request.body.fullName,
			avatarUrl: request.body.avatarUrl,
			passwordHash: hash,
		});

		const user = await document.save();

		const token = jwt.sign(
			{
				_id: user._id,
			},
			"secret123",
			{
				expiresIn: "30d",
			}
		);

		const { passwordHash, ...userData } = user._doc;

		response.json({
			...userData,
			token,
		});
	} catch (error) {
		console.log(error);
		response.status(500).json({
			message: "Регистрация не удалась",
		});
	}
};

const login = async (request, response) => {
	try {
		const user = await UserModel.findOne({ email: request.body.email });

		if (!user) {
			return response.status(404).json({
				message: "Пользователь не найден",
			});
		}
		const isValidPass = await bcrypt.compare(
			request.body.password,
			user._doc.passwordHash
		);

		if (!isValidPass) {
			return response.status(400).json({
				message: "Неверный логин или пароль",
			});
		}
		const token = jwt.sign(
			{
				_id: user._id,
			},
			"secret123",
			{
				expiresIn: "30d",
			}
		);
		const { passwordHash, ...userData } = user._doc;

		response.json({
			...userData,
			token,
		});
	} catch (error) {
		response.status(500).json({
			message: "Авторизация не удалась",
		});
	}
};

const getMe = async (request, response) => {
	try {
		const user = await UserModel.findById(request.userId);

		if (!user) {
			return response.status(404).json({
				message: "Пользователь не найден",
			});
		}
		const { passwordHash, ...userData } = user._doc;

		response.json(userData);
	} catch (error) {
		response.status(500).json({
			message: "Нет доступа",
		});
	}
};

export { register, login, getMe };
