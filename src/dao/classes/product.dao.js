import { logger } from "../../app.js"
import { productModel } from "../models/product.model.js"
export default class Product {
	//Muestra los productos
	getProducts = async () => {
		const products = await productModel.find({}).lean()
		return products
	}
	//Muestra un producto por su id
	getProductById = async (id) => {
		const product = await productModel.findOne({ _id: id })
		return product
	}
	//Agregando producto
	addProduct = async (newProduct) => {
		logger.info(JSON.stringify(newProduct))
		const repeatCode = await productModel.findOne({ code: newProduct.code })

		if (repeatCode) {
			logger.info("Codigo invalido")
			return
		}
		try {
			const products = await productModel.create(newProduct)

			return products
		} catch (error) {
			logger.info(error)
		}
	}
	//Actualiza un producto
	updateProduct = async (id, obj) => {
		await productModel.updateOne({ _id: id }, obj).lean()
		return obj
	}
	//Elimina un producto
	deleteProduct = async (id) => {
		try {
			const products = await productModel.findByIdAndDelete(id)
			return products
		} catch (error) {
			logger.info(error)
		}
	}
}
