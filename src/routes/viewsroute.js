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
import { usersView } from "../controllers/user.controller.js"
import { productView } from "../controllers/product.controller.js"
import { homeView } from "../controllers/home.controller.js"
import { realtimeView } from "../controllers/realtime.controller.js"
import { chatView } from "../controllers/chat.controller.js"
import { cartView } from "../controllers/cart.controller.js"
import { test } from "../controllers/logger.controller.js"

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

viewRouter.use(isAuthenticated)

//Routes protected
viewRouter.get("/", homeView)
viewRouter.get("/products", productView)
viewRouter.get("/logout", destroySession)
viewRouter.get("/chat", chatView)
viewRouter.get("/cart", cartView)

//Admin routes
viewRouter.get("/user", isAdmin, usersView)
viewRouter.get("/realtimeproducts", isPremium, realtimeView)

export default viewRouter
