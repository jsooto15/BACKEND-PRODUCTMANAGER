import { logger } from "../../app.js"
import { userModel } from "../models/user.model.js"
export default class User {
	//Muestra los productos
	getUsers = async () => {
		const users = await userModel.find({}).lean()
		logger.info(users)
		return users
	}
	//Muestra un usuario por su id
	getUserById = async (id) => {
		const user = await userModel.findOne({ _id: id })
		return user
	}
	//Muestra un usuario por su correo
	getUserByEmail = async (email) => {
		const user = await userModel.findOne({ email })
		return user
	}
	//Agregando producto
	addUser = async (newUser) => {
		const repeatCode = await userModel.find({ email: newUser.email })
		if (repeatCode) {
			logger.info("Codigo invalido")
			return
		}
		try {
			const user = await userModel.create({ ...newUser, cart: cartId })
			logger.info("created user", user)
			return user
		} catch (error) {
			logger.fatal(error)
		}
	}
	//Actualiza un producto
	updateUser = async (id, obj) => {
		await userModel.updateOne({ _id: id }, obj).lean()
		return obj
	}
	//Elimina un producto
	deleteUser = async (id) => {
		try {
			const user = await userModel.findByIdAndDelete(id)
			return user
		} catch (error) {
			logger.info(error)
		}
	}
}
