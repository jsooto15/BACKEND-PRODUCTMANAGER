import { Router } from "express"
import UserManager from "../dao/database/usermanager.js"
import { isAuthenticated } from "../middlewares/index.js"
const sessionRouter = Router()

const manager = new UserManager()

sessionRouter.get("/current", isAuthenticated, async (req, res) => {
	try {
		return res.status(200).json({data:req.user})
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

export default sessionRouter
