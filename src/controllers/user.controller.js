import { logger } from "../app.js"
import User from "../dao/classes/user.dao.js"
import { userModel } from "../dao/models/user.model.js"
import { AvailabilityError, PermissionError, errorHandler } from "../errors.js"
import { generateUser } from "../utils.js"
const userService = new User()

export const usersView = async (req, res) => {
	logger.info("esta autenticado", req?.isAuthenticated())
	const users = await userModel.find({}).lean()
	res.render("users", { users })
}

export const index = async (req, res) => {
	try {
		let users = []
		for (let i = 0; i < 100; i++) {
			users.push(generateUser())
		}
		res.send({ status: "success", payload: users })
	} catch (error) {
		errorHandler(error, req, res)
	}
}
export const show = async (req, res) => {
	try {
		const id = req.params.id
		const user = await userService.getUserById(id)

		if (user) {
			res.send(user)
		} else {
			throw new AvailabilityError("Usuario no encontrado")
		}
	} catch (error) {
		errorHandler(error, req, res)
	}
}

export const update = async (req, res) => {
	try {
		const userData = req.body
		const { id } = req.params
		const userFind = await userService.getUserById(id)
		if (userFind) {
			await userService.updateUser(id, userData)
			res.status(200).json({ message: "User updated successfully" })
		} else {
			throw new AvailabilityError("Usuario no encontrado")
		}
	} catch (error) {
		errorHandler(error, req, res)
	}
}

export const destroy = async (req, res) => {
	try {
		const userId = req.params.pid
		const eliminar = await userService.deleteUser(userId)
		res.json(eliminar)
	} catch (error) {
		errorHandler(error, req, res)
	}
}
export const changeRole = async (req, res) => {
	try {
		const { uid } = req.params
		const userFind = await userService.getUserById(uid)
		if (userFind) {
			if (userFind?.role === "premium"){
				await userService.updateUser(id, { role: "user" })
			}
			if (userFind?.role === "user"){
				await userService.updateUser(id, { role: "premium" })
			}
			if (userFind?.role === "admin"){
				throw new PermissionError('No puedes cambiar el rol de un admin')
			}
			res.status(200).json({ message: "User updated successfully" })
		} else {
			throw new AvailabilityError("Usuario no encontrado")
		}
	} catch (error) {
		errorHandler(error, req, res)
	}
}
