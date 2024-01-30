import { logger } from "../../index.js"
import { productModel } from "../dao/models/product.model.js"

export const realtimeView = async (req, res) => {
	const products = await productModel.find({}).lean()
	logger.debug(JSON.stringify(products))
	res.render("realtimeproducts", { products })
}