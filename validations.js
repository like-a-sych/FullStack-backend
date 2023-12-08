import { body } from "express-validator";

const loginValidation = [
	body("email", "Неверный формат почты").isEmail(),
	body("password", "Пароль должен быть не меньше 5 символов").isLength({
		min: 5,
	}),
];
const registerValidation = [
	body("email", "Неверный формат почты").isEmail(),
	body("password", "Пароль должен быть не меньше 5 символов").isLength({
		min: 5,
	}),
	body("fullName", "В имени должно быть минимум 2 символа").isLength({
		min: 2,
	}),
	body("avatarUrl", "Неверная ссылка").optional().isURL(),
];
const postCreateValidation = [
	body("title", "Введите заголовок статьи")
		.isLength({
			min: 3,
		})
		.isString(),
	body("text", "Введите текст статьи")
		.isLength({
			min: 10,
		})
		.isString(),
	body("tags", "неверный формат тэгов (укажите массив)").optional().isArray(),
	body("imageUrl", "Неверная ссылка").optional().isString(),
];

export { loginValidation, registerValidation, postCreateValidation };
