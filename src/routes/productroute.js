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
/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: show all products
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
prodRouter.get("/", index)
// En la ruta GET, debe devolver un producto específico según el productId
/**
 * @openapi
 * /api/products/{pid}:
 *   get:
 *     summary: show a product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
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
prodRouter.get("/:pid", show)
// En la ruta POST, debe agregar un nuevo producto

/**
 * @openapi
 * /api/products:
 *   post:
 *     summary: create a product
 *     tags:
 *       - Products
 *     requestBody:
 *       description: Product create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestProduct'
 *     responses:
 *       201:
 *         description: created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Products'
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
prodRouter.post("/",isPremium, store)
// En la ruta PUT, debe actualizar el producto

/**
 * @openapi
 * /api/products/{pid}:
 *   put:
 *     summary: update a product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       description: Product update
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestProduct'
 *     responses:
 *       200:
 *         description: updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Products'
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
prodRouter.put("/:pid",isPremium ,update)
// En la ruta DELETE, debe borrar el producto especificado en la ruta

/**
 * @openapi
 * /api/products/{pid}:
 *   delete:
 *     summary: delete a product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Products'
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
prodRouter.delete("/:pid", isPremium, destroy)

export default prodRouter
