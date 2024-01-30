import passport from "passport"
import { UserDTO } from "../dto/user.dto.js"
import { logger } from "../app.js"
import JWT from "jsonwebtoken"
import { AvailabilityError, ValidateError, errorHandler } from "../errors.js"
import User from "../dao/classes/user.dao.js"
import { enviarCorreoRecuperacion } from "../utils.js"
const userService = new User()

const SECRET = process.env.JWT_SECRET || "secret"

export const loginView = async (req, res) => {
	res.render("login", {})
}

export const loginPost = passport.authenticate("local-login", {
	successRedirect: "/",
	failureRedirect: "/login",
	failureMessage: true,
})

export const registerView = async (req, res) => {
	res.render("register", {})
}

export const registerPost = passport.authenticate("local-register", {
	successRedirect: "/",
	failureRedirect: "/register",
	failureMessage: true,
})

export const githubView = passport.authenticate("github", {
	scope: ["user:email"],
})
export const githubViewNext = (req, res) => {
	// The request will be redirected to GitHub for authentication, so this
	// function will not be called.
}

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
export const githubCallbackView = passport.authenticate("github", {
	failureRedirect: "/login",
})
export const githubCallbackViewNext = (req, res) => {
	res.redirect("/")
}
export const destroySession = async (req, res) => {
	const id = req.user.id
	const userData = { last_connection: new Date()}
	const userFind = await userService.getUserById(id)
	if (userFind) {
		await userService.updateUser(id, userData)
	}
	req.logout({}, (err) => {
		logger.error(err?.message)
	})
	res.redirect("/login")
}
export const currentSession = async (req, res) => {
	try {
		return res.status(200).json({ data: new UserDTO(req.user) })
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body
		if (!email) {
			throw new ValidateError("Faltó el correo")
		}
		const user = await userService.getUserByEmail(email)
		if (!user) {
			throw new AvailabilityError("Usuario no encontrado")
		}
		const secret = SECRET + user.email + user.password
		const payload = {
			email,
			id: user.id,
		}
		const token = JWT.sign(payload, secret, { expiresIn: "60m" })
		const link = `http://localhost:8080/reset-password/${user.id}/${token}`
		logger.debug(link)
		logger.debug("Creando correo")
		await enviarCorreoRecuperacion(link, email)
		logger.debug("Correo enviado")
		res.send("Un enlace de recuperacion ha sido enviado a tu correo " + email)
	} catch (error) {
		errorHandler(error, req, res)
	}
}
export const forgotPasswordView = async (req, res) => {
	res.render("forgot", {})
}
export const resetPassword = async (req, res) => {
	const { id, token } = req.params
	const { pass, pass2 } = req.body
	try {
		if (!id) {
			throw new ValidateError("Faltó el usuario")
		}
		if (!token) {
			throw new ValidateError("Faltó el token")
		}
		const user = await userService.getUserById(id)
		if (!user) {
			throw new AvailabilityError("Usuario no encontrado")
		}
		if (pass !== pass2) {
			throw new ValidateError("Las contraseñas deben ser iguales")
		}
		if (user.comparePassword(pass)) {
			throw new ValidateError("Esta contraseña ya ha sido usada")
		}
		const secret = SECRET + user.email + user.password
		const payload = JWT.verify(token, secret)
		user.password = user.encryptPassword(pass)
		user.save()
		res.render("login", {})
	} catch (error) {
		logger.warning("error on resetPassword")
		logger.error(error.message)
		const user = await userService.getUserById(id)
		res.render("resetPassword", { error: error.message, email: user.email })
	}
}
export const resetPasswordView = async (req, res) => {
	try {
		const { id, token } = req.params
		if (!id) {
			throw new ValidateError("Faltó el usuario")
		}
		if (!token) {
			throw new ValidateError("Faltó el token")
		}
		const user = await userService.getUserById(id)
		if (!user) {
			throw new AvailabilityError("Usuario no encontrado")
		}
		const secret = SECRET + user.email + user.password
		const payload = JWT.verify(token, secret)
		res.render("resetPassword", { id, token, email: user.email })
	} catch (error) {
		logger.warning("El enlace ha caducado")
		logger.error(error.message)
		res.render("forgot", { error: "El enlace ha caducado, intenta de nuevo" })
	}
}
