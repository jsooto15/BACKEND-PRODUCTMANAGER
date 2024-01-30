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
/**
 * @openapi
 * /api/carts:
 *   get:
 *     summary: show all carts
 *     tags:
 *       - Carts
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Carts'
 */
cartRouter.get("/", index)
//Ruta addCart
/**
 * @openapi
 * /api/carts:
 *   post:
 *     summary: create cart
 *     tags:
 *       - Carts
 *     requestBody:
 *       description: Cart create
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestCart'
 *     responses:
 *       201:
 *         description: created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carts'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: "Some error message"
 */
cartRouter.post("/", store)
//Ruta getProductsInCart
/**
 * @openapi
 * /api/carts/{cid}:
 *   get:
 *     summary: show cart
 *     tags:
 *       - Carts
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carts'
 */
cartRouter.get("/:cid", show)
// Ruta para actualizar el carrito
/**
 * @openapi
 * /api/carts/{cid}:
 *   put:
 *     summary: update cart
 *     tags:
 *       - Carts
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         description: Cart ID
 *     requestBody:
 *       description: Cart update
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestCart'
 *     responses:
 *       201:
 *         description: created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carts'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: "Some error message"
 */
cartRouter.put("/:cid", update)
// Ruta para efectuar la compra y generar el ticket
/**
 * @openapi
 * /api/carts/{cid}/purchase:
 *   post:
 *     summary: make purchase and generate ticket
 *     tags:
 *       - Carts
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         description: Cart ID
 *     responses:
 *       201:
 *         description: purchased
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: "Some error message"
 *                 ticket: 
 *                   type: string
 *                   example: "fnf3oi883"
 *                 failedProducts:
 *                   type: array
 *                   items:
 *                     type: number
 *                     example: ['61dbae02-c147-4e28-863c-db7bd402b2d6','61dbae02-c147-4e28-863c-db7bd402b2d6']
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: "Some error message"
 *                 ticket: 
 *                   type: string
 *                   example: "fnf3oi883"
 *                 failedProducts:
 *                   type: array
 *                   items:
 *                     type: number
 *                     example: ['61dbae02-c147-4e28-863c-db7bd402b2d6','61dbae02-c147-4e28-863c-db7bd402b2d6']
 */
cartRouter.post("/:cid/purchase", purchase)
// En la ruta DELETE, Eliminar todos los productos de un cart

/**
 * @openapi
 * /api/carts/{cid}:
 *   delete:
 *     summary: delete cart
 *     tags:
 *       - Carts
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carts'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: "Some error message"
 */
cartRouter.delete("/:cid", destroy)

//PRODUCTS IN CART

//Ruta addproductincart
/**
 * @openapi
 * /api/carts/{cid}/products/{pid}:
 *   post:
 *     summary: create product in cart
 *     tags:
 *       - Carts
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         description: Cart ID
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         description: Product ID
*     requestBody:
 *       description: Product cart create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 34
 *     responses:
 *       200:
 *         description: deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: "success message"
 *                 cid: 
 *                   type: string
 *                   example: "61dbae02-c147-4e28-863c-db7bd402b2d6"
 *                 pid: 
 *                   type: string
 *                   example: "61dbae02-c147-4e28-863c-db7bd402b2d6"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: "Some error message"
 */
cartRouter.post("/:cid/product/:pid",isNotAdmin, storeProduct)
// Ruta para modificar cantidad
/**
 * @openapi
 * /api/carts/{cid}/products/{pid}:
 *   put:
 *     summary: update product in cart
 *     tags:
 *       - Carts
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         description: Cart ID
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         description: Product ID
*     requestBody:
 *       description: Product cart update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 34
 *     responses:
 *       200:
 *         description: deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: "success message"
 *                 cid: 
 *                   type: string
 *                   example: "61dbae02-c147-4e28-863c-db7bd402b2d6"
 *                 pid: 
 *                   type: string
 *                   example: "61dbae02-c147-4e28-863c-db7bd402b2d6"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: "Some error message"
 */
cartRouter.put("/:cid/products/:pid", updateProduct)
//Ruta Eliminar Producto por id
/**
 * @openapi
 * /api/carts/{cid}/products/{pid}:
 *   delete:
 *     summary: delete product in cart
 *     tags:
 *       - Carts
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         description: Cart ID
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         description: Product ID
*     requestBody:
 *       description: Product cart delete
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 34
 *     responses:
 *       200:
 *         description: deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: "success message"
 *                 cid: 
 *                   type: string
 *                   example: "61dbae02-c147-4e28-863c-db7bd402b2d6"
 *                 pid: 
 *                   type: string
 *                   example: "61dbae02-c147-4e28-863c-db7bd402b2d6"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: "Some error message"
 */
cartRouter.delete("/:cid/products/:pid", destroyProduct)
export default cartRouter
