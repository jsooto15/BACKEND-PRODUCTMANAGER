import { messageModel } from "../dao/models/messagemodel.js"
import { ValidateError, errorHandler } from "../errors.js"

export const index = async (req, res) => {
	const messages = await messageModel.find()
	res.send(messages)
}

export const store = async (req, res) => {
	try {
		const { user, text } = req.body
		if (!user) {
			throw new ValidateError("Error en la propiedad usuario")
		}
		if (!text) {
			throw new ValidateError("Error en la propiedad texto")
		}
		const messages = await messageModel.create({
			user,
			text,
		})
		res.send(messages)
	} catch (error) {
		errorHandler(error, req, res)
	}
}
