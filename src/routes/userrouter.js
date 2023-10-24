import { Router } from "express"
import UserManager from "../dao/database/usermanager.js"
const userRouter = Router()


const manager = new UserManager()



userRouter.get("/:id", async (req, res) => {
	try {
		const id = req.params.id
		const user = await manager.getUserById(id)

		if (user) {
			res.send(user)
		} else {
			res.status(404).send("Product not found")
		}
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

userRouter.put("/:id", async (req, res) => {
	try {
		const userData = req.body
		const { id } = req.params
		const userFind = await manager.getUserById(id)
		if (userFind) {
			await manager.updateUser(id, userData)
			res.status(200).json({ message: "User updated successfully" })
		} else {
			res.status(404).send("User not found")
		}
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

// userRouter.post("/", async (req, res) => {
// 	try {
// 		const {
// 			title,
// 			description,
// 			price,
// 			stock,
// 			thumbnail,
// 			code,
// 			category,
// 			status,
// 		} = req.body
// 		const newProd = await manager.addProduct(
// 			title,
// 			description,
// 			price,
// 			stock,
// 			thumbnail,
// 			code,
// 			category,
// 			status
// 		)

// 		req.context.socketServer.emit()

// 		res.json(newProd)
// 	} catch (error) {
// 		res.status(500).json({ message: error.message })
// 	}
// })


userRouter.delete("/:pid", async (req, res) => {
	try {
		const userId = req.params.pid
		const eliminar = await manager.deleteUser(userId)
		res.json(eliminar)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

export default userRouter
