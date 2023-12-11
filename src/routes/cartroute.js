import { Router } from "express"
import {
	destroy,
	destroyProduct,
	index,
	purchase,
	show,
	store,
	storeProduct,
	update,
	updateProduct,
} from "../controllers/cart.controller.js"
import { isNotAdmin, isUser } from "../middlewares/index.js"
const cartRouter = Router()

//Ruta getAllCarts
cartRouter.get("/", index)
//Ruta addCart
cartRouter.post("/", store)
//Ruta getProductsInCart
cartRouter.get("/:cid", show)
// Ruta para actualizar el carrito
cartRouter.put("/:cid", update)
// Ruta para efectuar la compra y generar el ticket
cartRouter.post("/:cid/purchase", purchase)
// En la ruta DELETE, Eliminar todos los productos de un cart
cartRouter.delete("/:cid", destroy)

//PRODUCTS IN CART

//Ruta addproductincart
cartRouter.post("/:cid/product/:pid",isNotAdmin, storeProduct)
// Ruta para modificar cantidad
cartRouter.put("/:cid/products/:pid", updateProduct)
//Ruta Eliminar Producto por id
cartRouter.delete("/:cid/products/:pid", destroyProduct)
export default cartRouter
