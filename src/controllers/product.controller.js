import { productModel } from "../dao/models/product.model.js"
import Product from "../dao/classes/product.dao.js"
import {
	AvailabilityError,
	PermissionError,
	ValidateError,
	errorHandler,
} from "../errors.js"
import { logger } from "../app.js"
import { enviarCorreoProducto } from "../utils.js"

const productService = new Product()

export const productView = async (req, res) => {
	const pageId = parseInt(req.query.page) || 1
	const limit = parseInt(req.query.limit) || 4
	const sort = req.query.sort || "asc"
	const query = req.query.query || ""
	const stockQuery = req.query.status || ""

	//Sort
	const sortOptions = {}
	if (sort === "asc") {
		sortOptions.price = 1
	} else if (sort === "desc") {
		sortOptions.price = -1
	}

	// filtro por category, description y title
	const filter = {}
	if (query) {
		filter.$or = [
			{ category: { $regex: new RegExp(query, "i") } },
			{ title: { $regex: new RegExp(query, "i") } },
			{ description: { $regex: new RegExp(query, "i") } },
		]
	}

	if (stockQuery === "true" || stockQuery === "false") {
		filter.status = stockQuery === "true"
	}

	//Paginate:
	const result = await productModel.paginate(filter, {
		page: pageId, //queremos ir a la pagina x
		limit, // con limite de tantos productos
		sort: sortOptions, // sort con Opciones: asc y desc
		lean: true,
	})

	const prevPage = pageId > 1 ? pageId - 1 : null // Página previa o null si no hay
	const nextPage = result.hasNextPage ? pageId + 1 : null // Página siguiente o null si no hay

	const prevLink = prevPage ? `/products?page=${prevPage}` : null
	const nextLink = nextPage ? `/products?page=${nextPage}` : null

	const pageNumbers = []
	if (prevPage) {
		pageNumbers.push({
			number: prevPage,
			link: prevLink,
			isPrevious: true,
		})
	}
	pageNumbers.push({
		number: pageId,
		link: `/products/${pageId}/${limit}/${sort}/${query}`,
		isCurrent: true,
	})
	if (nextPage) {
		pageNumbers.push({
			number: nextPage,
			link: nextLink,
			isNext: true,
		})
	}
	logger.info(result.docs)

	res.render("products", {
		status: "success",
		payload: result.docs,
		products: result.docs,
		prevLink,
		nextLink,
		pageNumbers,
		currentPage: pageId,
		currentLimit: limit,
		currentSort: sort,
		currentQuery: query,
		currentStock: stockQuery,
	})
	// const responseObject = {
	// 	status: "success",
	// 	payload: result.docs,
	// 	totalDocs: result.totalDocs,
	// 	limit: result.limit,
	// 	totalPages: result.totalPages,
	// 	page: result.page,
	// 	pagingCounter: result.pagingCounter,
	// 	hasPrevPage: result.hasPrevPage,
	// 	hasNextPage: result.hasNextPage,
	// 	prevPage: result.prevPage,
	// 	nextPage: result.nextPage,
	// }
	/*logger.info("Resumen:", responseObject);*/
}

export const index = async (req, res) => {
	const { limit } = req.query
	const readproduct = await productService.getProducts()
	if (limit) {
		const limitProduct = readproduct.splice(0, parseInt(limit))
		res.send(limitProduct)
	} else {
		res.send(readproduct)
	}
}
export const show = async (req, res) => {
	try {
		const pid = req.params.pid
		const product = await productService.getProductById(pid)

		if (product) {
			res.send(product)
		} else {
			throw new AvailabilityError("El producto no se encuentra disponible")
		}
	} catch (error) {
		errorHandler(error, req, res)
	}
}
export const store = async (req, res) => {
	try {
		const {
			title,
			description,
			price,
			stock,
			thumbnail,
			code,
			category,
			status,
		} = req.body

		logger.debug(req.body)
		if (!title) {
			throw new ValidateError("El producto debe tener nombre")
		}
		if (!description) {
			throw new ValidateError("El producto debe tener descripcion")
		}
		if (!price) {
			throw new ValidateError("El producto debe tener precio")
		}
		if (!code) {
			throw new ValidateError("El producto debe tener código")
		}
		const owner = req?.user?.email || "admin"
		logger.debug("Owner: " + JSON.stringify(req?.user))
		const prod = {
			title,
			description,
			price,
			stock,
			thumbnail,
			code,
			category,
			status,
			owner,
		}
		const newProd = await productService.addProduct(prod)

		req.context.socketServer.emit()

		res.status(201).json(newProd)
	} catch (error) {
		errorHandler(error, req, res)
	}
}

export const update = async (req, res) => {
	try {
		const prod = req.body
		const { pid } = req.params
		const prodFind = await productService.getProductById(pid)
		if (req?.user?.role !== "admin" && prodFind?.owner !== req?.user?.email) {
			throw new PermissionError(
				"No puede editar un producto que no te pertenece"
			)
		}
		if (prodFind) {
			await productService.updateProduct(pid, prod)
			res.send("Product updated successfully")
		} else {
			throw new AvailabilityError("Producto no encontrado")
		}
	} catch (error) {
		errorHandler(error, req, res)
	}
}
export const destroy = async (req, res) => {
	try {
		const productId = req.params.pid
		const prodFind = await productService.getProductById(productId)
		if (req?.user?.role !== "admin" && prodFind?.owner !== req?.user?.email) {
			throw new PermissionError(
				"No puede eliminar un producto que no te pertenece"
			)
		}
		if (prodFind?.owner !== req?.user?.email) {
			enviarCorreoProducto(prodFind.title, prodFind?.owner)
		}
		const eliminar = await productService.deleteProduct(productId)
		res.json(eliminar)
	} catch (error) {
		errorHandler(error, req, res)
	}
}
