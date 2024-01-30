import { logger } from "../app.js"
import Cart from "../dao/classes/cart.dao.js"
import Product from "../dao/classes/product.dao.js"
import Ticket from "../dao/classes/ticket.dao.js"
import { AvailabilityError, PermissionError, ValidateError, errorHandler } from "../errors.js"
const cartService = new Cart()
const productService = new Product()
const ticketService = new Ticket()

export const cartView = async (req, res) => res.render("cart")
export const index = async (req, res) => {
	try {
		const allCarts = await cartService.getAllCarts()
		res.json(allCarts)
	} catch (error) {
		errorHandler(error, req, res)
	}
}
export const store = async (req, res) => {
	const products = req.body
	try {
		const cart = { products }
		const cartId = await cartService.addCart(cart)
		res.status(201).json({ message: "Carrito creado", cartId, cart })
	} catch (error) {
		console.error("Error creando el carrito", error)
		errorHandler(error, req, res)
	}
}
export const show = async (req, res) => {
	try {
		const cartId = req.params.cid
		const products = await cartService.getProductsInCart(cartId)
		res.json(products)
	} catch (error) {
		errorHandler(error, req, res)
	}
}
export const update = async (req, res) => {
	try {
		const cartId = req.params.cid
		const updatedCartData = req.body

		const cart = await cartService.getCartById(cartId)

		if (!cart) {
			throw new Error("Carrito no encontrado")
		}

		if (updatedCartData.products) {
			cart.products = updatedCartData.products
		}
		await cart.save()

		res.json({ message: "Cart updated successfully", cart })
	} catch (error) {
		errorHandler(error, req, res)
	}
}

export const destroy = async (req, res) => {
	try {
		const cartId = req.params.cid
		const cart = await cartService.getCartById(cartId)
		if (!cart) {
			throw new Error("Carrito no encontrado")
		}
		cart.products = []
		await cart.save()
		return res.json({ message: "All products removed from cart" })
	} catch (error) {
		errorHandler(error, req, res)
	}
}

export const purchase = async (req, res) => {
	try {
		const cartId = req.params.cid
		const products = await cartService.getProductsInCart(cartId)
		logger.info("productos en el carrito", products)
		const blockedProducts = []
		const purchasedProducts = []
		let totalAmount = 0
		await Promise.all(
			products.map(async (el) => {
				const storedProduct = await productService.getProductById(
					el.product._id
				)
				logger.info("stored product", storedProduct)
				logger.info("purchase product", el.product)
				if (storedProduct.stock < el.quantity) {
					logger.info("stock vs quantity", storedProduct.stock, el.quantity)
					blockedProducts.push(el)
				} else {
					purchasedProducts.push(el)
					storedProduct.stock -= el.quantity
					logger.info("new stock", storedProduct.stock)
					storedProduct.save()
					logger.info("new product", storedProduct)
					totalAmount += storedProduct.price * el.quantity
				}
			})
		)
		if (purchasedProducts.length <= 0) {
			throw new AvailabilityError(
				"Ninguno de los productos seleccionados estan disponibles"
			)
		}
		const updatedCart = await cartService.updateCart(cartId, {
			products: [...blockedProducts],
		})

		const newTicket = await ticketService.addTicket({
			amount: totalAmount,
			purchaser: req.user.email,
		})

		//generate ticket
		if (blockedProducts.length <= 0) {
			return res.json({
				message: "Su compra fue exitosa",
				ticket: newTicket,
			})
		} else {
			return res.json({
				message: `Algunos productos del carrito no pudieron ser comprados`,
				ticket: newTicket,
				failedProducts: blockedProducts.map((el) => el.product._id),
			})
		}
	} catch (error) {
		errorHandler(err, req, res)
	}
}

//Products in cart

export const storeProduct = async (req, res) => {
	try {
		const cid = req.params.cid
		const pid = req.params.pid
		const quantity = req.body.quantity || 1
		
		const cart = await cartService.getCartById(cid)
		if (!cart) {
			throw new AvailabilityError("Carrito no encontrado")
		}
		const product = await productService.getProductById(pid)
		if (!product) {
			throw new AvailabilityError("Producto no encontrado")
		}
		if (product.stock < quantity) {
			throw new AvailabilityError("Cantidad de producto no disponible")
		}
		if (req?.user?.role !== "admin" && product?.owner === req?.user?.email) {
			throw new PermissionError(
				"No puede agregar al carrito un producto propio"
			)
		}
		await cartService.addProductToCartId(cid, pid, quantity)
		res.json({
			message: "Producto agregado al carrito",
			productId: pid,
			cartId: cid,
		})
	} catch (error) {
		console.error("Error agregando el producto", error)
		return errorHandler(error, req, res)
	}
}

export const updateProduct = async (req, res) => {
	try {
		const cid = req.params.cid
		const pid = req.params.pid
		const quantity = req.body.quantity
		logger.info("pid:", pid)

		const cart = await cartService.getCartById(cid)
		logger.info("Cart:", cart)

		if (!cart) {
			throw new AvailabilityError("Carrito no encontrado")
		}
		logger.info(cart)

		const product = await productService.getProductById(pid)
		if (!product) {
			throw new AvailabilityError("Producto no encontrado")
		}
		logger.info(product)
		if (req?.user?.role !== "admin" && product?.owner === req?.user?.email) {
			throw new PermissionError(
				"No puede agregar al carrito un producto propio"
			)
		}

		await cartService.updateProductQuantity(cid, pid, quantity)
		logger.info(quantity)
		res.json({
			message: "Product quantity modified!",
			productId: pid,
			cartId: cid,
		})
	} catch (error) {
		errorHandler(error, req, res)
	}
}
export const destroyProduct = async (req, res) => {
	try {
		const cid = req.params.cid
		const pid = req.params.pid
		const quantity = req.body.quantity || 1

		if (quantity <= 0) {
			throw new ValidateError("La cantidad requerida debe ser mayor que 0")
		}

		const cart = await cartService.getCartById(cid)
		if (!cart) {
			throw new AvailabilityError("Carrito no encontrado")
		}
		logger.info
		const product = await productService.getProductById(pid)
		if (!product) {
			throw new AvailabilityError("Producto no encontrado")
		}

		await cartService.deleteProductFromCart(cid, pid)
		res.json({
			message: "Producto eliminado del carrito",
			productId: pid,
			cartId: cid,
		})
	} catch (error) {
		console.error("Error agregando producto al carrito", error)
		errorHandler(err, req, res)
	}
}
