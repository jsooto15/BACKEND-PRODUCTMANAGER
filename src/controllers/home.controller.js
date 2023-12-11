import Product from "../dao/classes/product.dao.js"
import { errorHandler } from "../errors.js"
const productService = new Product()

export const homeView = async (req, res) => {
	try{
		const products = await productService.getProducts()
		res.render("home", { products })
	}catch(error){
		errorHandler(error, req, res)
	}
}
