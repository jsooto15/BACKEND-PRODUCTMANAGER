import { Router } from "express"
import { __dirname } from "../path.js"
import { isAdmin, isAuthenticated, isPremium } from "../middlewares/index.js"
import {
	destroySession,
	forgotPassword,
	forgotPasswordView,
	githubCallbackView,
	githubCallbackViewNext,
	githubView,
	githubViewNext,
	loginPost,
	loginView,
	registerPost,
	registerView,
	resetPassword,
	resetPasswordView,
} from "../controllers/auth.controller.js"
import { profileView, usersView } from "../controllers/user.controller.js"
import { productView } from "../controllers/product.controller.js"
import { homeView } from "../controllers/home.controller.js"
import { realtimeView } from "../controllers/realtime.controller.js"
import { chatView } from "../controllers/chat.controller.js"
import { cartView } from "../controllers/cart.controller.js"
import { test } from "../controllers/logger.controller.js"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

// Basic Meta Informations about our API
const options = {
	definition: {
		openapi: "3.0.0",
		info: { title: "Product Manager API", version: "1.0.0" },
	},
	apis: [
		"./src/routes/productroute.js",
		"./src/dao/models/product.model.js",
		"./src/routes/cartroute.js",
		"./src/dao/models/cart.models.js",
	],
}

// Docs in JSON format
const swaggerSpec = swaggerJSDoc(options)

//Router declaration
const viewRouter = Router()

//Auth routes
viewRouter.get("/login", loginView)
viewRouter.post("/login", loginPost)
viewRouter.get("/register", registerView)
viewRouter.post("/register", registerPost)
viewRouter.get("/forgot-password", forgotPasswordView)
viewRouter.post("/forgot-password", forgotPassword)
viewRouter.get("/reset-password/:id/:token", resetPasswordView)
viewRouter.post("/reset-password/:id/:token", resetPassword)
viewRouter.get("/auth/github", githubView, githubViewNext)
viewRouter.get(
	"/auth/github/callback",
	githubCallbackView,
	githubCallbackViewNext
)
viewRouter.get("/loggerTest", test)
viewRouter.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
// Make our docs in JSON format available
viewRouter.get("/api/docs.json", (req, res) => {
	res.setHeader("Content-Type", "application/json")
	res.send(swaggerSpec)
})

viewRouter.use(isAuthenticated)

//Routes protected
viewRouter.get("/", homeView)
viewRouter.get("/products", productView)
viewRouter.get("/logout", destroySession)
viewRouter.get("/chat", chatView)
viewRouter.get("/cart", cartView)
viewRouter.get("/profile", profileView)

//Admin routes
viewRouter.get("/user", isAdmin, usersView)
viewRouter.get("/realtimeproducts", isPremium, realtimeView)

export default viewRouter
