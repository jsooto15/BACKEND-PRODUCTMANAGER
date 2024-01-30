import { Router } from "express"
import { changeRole, destroy, destroyAll, index, show, update, upload, uploadDocs } from "../controllers/user.controller.js"
import { isAuthenticated } from "../middlewares/index.js"

const userRouter = Router()

userRouter.get("/", index)
userRouter.get("/:id", show)
userRouter.put("/:id", update)
userRouter.delete("/:pid", destroy)
userRouter.delete("/", destroyAll)
userRouter.post("/premium/:uid", changeRole)
userRouter.post(
	"/:uid/documents",
	upload.fields([
		{ name: "profile", maxCount: 1 },
		{ name: "dni", maxCount: 1 },
		{ name: "domicilio", maxCount: 1 },
		{ name: "account", maxCount: 1 },
	]),
	uploadDocs
)

export default userRouter
