import { logger } from "../../index.js"
import User from "../dao/classes/user.dao.js"
import { userModel } from "../dao/models/user.model.js"
import { AvailabilityError, PermissionError, errorHandler } from "../errors.js"
import { generateUser } from "../utils.js"
import multer from "multer"
import path from "path"
const __dirname = path.resolve(path.dirname(""))

const userService = new User()
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		let folder = "documents"
		if (file.fieldname.toLowerCase().includes("profile")) {
			folder = "profiles"
		}
		if (file.fieldname.toLowerCase().includes("product")) {
			folder = "products"
		}
		cb(null, path.join(__dirname, `/uploads/${folder}`))
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
		cb(
			null,
			file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
		)
	},
})

export const upload = multer({ storage: storage })
export const profileView = async (req, res) =>
	res.render("profile", {
		documents: req.user.documents.map(({ name, reference }) => ({
			name,
			reference,
		})),
		first_name: req.user.first_name,
		last_name: req.user.last_name,
		email: req.user.email,
		role: req.user.role,
		age: req.user.age,
		last_connection: req.user.last_connection,
		status: req.user.status,
		_id: req.user._id,
	})

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
export const destroyAll = async (req, res) => {
	try {
		const users = await userService.lastConnectionUsers()
		if (users.lenght > 0) {
			const eliminados = []
			users.forEach(async (el) => {
				eliminados.push(await userService.deleteUser(el.id))
			})
			res.json(eliminados)
		} else {
			res.json({ message: "not users found" })
		}
	} catch (error) {
		errorHandler(error, req, res)
	}
}
export const changeRole = async (req, res) => {
	try {
		const { uid } = req.params
		const userFind = await userService.getUserById(uid)
		if (userFind) {
			if (userFind?.role === "premium") {
				await userService.updateUser(uid, { role: "user" })
			}
			if (userFind?.role === "user") {
				console.log(userFind?.documents)
				let cuenta = userFind?.documents.reduce((acc, cur) => {
					if (
						cur.name === "dni" ||
						cur.name === "domicilio" ||
						cur.name === "account"
						){
							return (acc += 1)
						}
						return acc

					}, 0)
					console.log(cuenta)
				if (cuenta >= 3) {
					await userService.updateUser(uid, { role: "premium" })
				} else {
					throw new PermissionError(
						"Necesitas tener al menos 3 documentos cargados"
					)
				}
			}
			if (userFind?.role === "admin") {
				throw new PermissionError("No puedes cambiar el rol de un admin")
			}
			res.status(200).json({ message: "User updated successfully" })
		} else {
			throw new AvailabilityError("Usuario no encontrado")
		}
	} catch (error) {
		errorHandler(error, req, res)
	}
}
export const uploadDocs = async (req, res) => {
	try {
		console.log("files", req.files)
		const { uid } = req.params
		console.log("user files", req.user.documents)
		let documents = [...req.user.documents]
		if ("profile" in req.files) {
			documents = documents.filter((el) => el.name !== "profile")
			documents.push({
				name: "profile",
				reference: req.files["profile"][0].filename,
			})
		}
		if ("dni" in req.files) {
			documents = documents.filter((el) => el.name !== "dni")
			documents.push({ name: "dni", reference: req.files["dni"][0].filename })
		}
		if ("domicilio" in req.files) {
			documents = documents.filter((el) => el.name !== "domicilio")
			documents.push({
				name: "domicilio",
				reference: req.files["domicilio"][0].filename,
			})
		}
		if ("account" in req.files) {
			documents = documents.filter((el) => el.name !== "account")
			documents.push({
				name: "account",
				reference: req.files["account"][0].filename,
			})
		}
		if (documents.length > 0) {
			console.log("documentos", documents)
			await userService.updateUser(uid, { documents })
		}
		// return res.status(200).json({ message: "Documents uploaded successfully" })
		return res.redirect("/profile")
	} catch (error) {
		errorHandler(error, req, res)
	}
}
