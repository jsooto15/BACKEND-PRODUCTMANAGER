import { logger } from "../../app.js"
import { cartModel } from "../models/cart.models.js"

export default class Cart {
	//Muestra todos los carritos
	getAllCarts = async () => {
		const carts = await cartModel.find().lean()
		return carts
	}
	//Agregando un carrito
	addCart = async (cart) => {
		const newCart = await cartModel.create(cart)
		logger.info("carrito creado", newCart)

		return newCart.id
	}
	//Muestra un carrito por id
	getCartById = async (id) => {
		const cart = await cartModel.findOne({ _id: id })
		return cart
	}
	updateCart = async (id, obj) => {
		await cartModel.updateOne({ _id: id }, obj).lean()
		return obj
	}
	//Muestra los productos en el carrito
	getProductsInCart = async (cartId) => {
		const cart = await this.getCartById(cartId)
		const populatedCart = await cart.populate("products.product")
		if (cart) {
			return populatedCart.products.filter((el) => el.product)
		} else {
			logger.info("Carrito no encontrado")
			return []
		}
	}
	// Agrega producto en carrito
	addProductToCartId = async (cid, productId) => {
		const cart = await this.getCartById(cid)
		logger.info(cart)

		let item = cart.products.find((p) => p?.product?.toString() === productId)
		logger.info("Id del producto a agregar", productId)
		if (item) {
			item.quantity++
		} else {
			const item = { product: productId, quantity: 1 }
			logger.info(item)
			cart.products.push(item)
		}
		logger.info(cart)
		await cart.save()
		return item
	}
	//Eliminar producto del carrito con el id
	deleteProductFromCart = async (cid, pid) => {
		try {
			logger.info(`Eliminando producto: ${pid} del carrito: ${cid}`)
			const cart = await this.getCartById(cid)

			const itemIndex = cart.products.findIndex(
				(product) => product.product?.toString() === pid
			)

			if (itemIndex !== -1) {
				// Si se encuentra el producto en el carrito, eliminarlo
				cart.products.splice(itemIndex, 1)
			} else {
				logger.info(`Producto de id: ${pid} no encontrado en el carrito.`)
			}

			logger.info(`Cart after deleted product: ${cart}`)
			await cart.save()
			return pid
		} catch (error) {
			console.error("Error:", error)
			throw error
		}
	}
	//Actualizando el carrito
	updateProductQuantity = async (cid, pid, quantity) => {
		try {
			const cart = await cartModel.findById(cid)
			logger.info(cart, "CARRITO ENCONTRADO")
			if (!cart) {
				throw new Error("Carrito no encontradi")
			}

			const productToUpdate = cart.products.find(
				(product) => product.toString() === pid
			)
			logger.info(productToUpdate, "PRODUCTO ENCONTRADO")
			if (!productToUpdate) {
				throw new Error("Producto no encontrado")
			}

			productToUpdate.quantity = quantity
			await cart.save()

			return cart
		} catch (error) {
			logger.info(error)
		}
	}
}
