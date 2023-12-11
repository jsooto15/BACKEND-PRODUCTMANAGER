import { Router } from "express"
import { isAuthenticated } from "../middlewares/index.js"
import { currentSession } from "../controllers/auth.controller.js"

const sessionRouter = Router()

sessionRouter.get("/current", isAuthenticated, currentSession)

export default sessionRouter
