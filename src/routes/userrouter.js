import { Router } from "express"
import { changeRole, destroy, index, show, update } from "../controllers/user.controller.js"

const userRouter = Router()

userRouter.get("/", index)
userRouter.get("/:id", show)
userRouter.put("/:id", update)
userRouter.delete("/:pid", destroy)
userRouter.post("/premium/:uid", changeRole)

export default userRouter
