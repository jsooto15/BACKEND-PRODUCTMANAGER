import { Router } from "express"
import {
	destroy,
	index,
	show,
	store,
	update,
} from "../controllers/product.controller.js"
import { isPremium } from "../middlewares/index.js"

const prodRouter = Router()

prodRouter.get("/", index)
// En la ruta GET, debe devolver un producto específico según el productId
prodRouter.get("/:pid", show)
// En la ruta POST, debe agregar un nuevo producto
prodRouter.post("/",isPremium, store)
// En la ruta PUT, debe actualizar el producto
prodRouter.put("/:pid",isPremium ,update)
// En la ruta DELETE, debe borrar el producto especificado en la ruta
prodRouter.delete("/:pid", isPremium, destroy)

export default prodRouter
