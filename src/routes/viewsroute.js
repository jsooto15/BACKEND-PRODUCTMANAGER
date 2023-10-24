import { Router } from "express"
const viewRouter = Router()
import { __dirname } from "../path.js"
import ProductManager from "../dao/database/productmanager.js"
const manager = new ProductManager()
import CartManager from "../dao/database/cartmanager.js"
const cartm = new CartManager()
import { productModel } from "../dao/models/product.model.js"
import passport from "passport"
import { userModel } from "../dao/models/user.model.js"
import { isAdmin, isAuthenticated } from "../middlewares/index.js"

viewRouter.get("/login", async (req, res) => {
    res.render("login", {})
})
viewRouter.post(
    "/login",
    passport.authenticate("local-login", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureMessage:true
    })
)
viewRouter.get("/register", async (req, res) => {
    res.render("register", {})
})
viewRouter.post(
    "/register",
    passport.authenticate(
        "local-register",
        {
            successRedirect: "/",
            failureRedirect: "/register",
            failureMessage:true,
        }
    )
)
viewRouter.get(
	"/auth/github",
	passport.authenticate("github", { scope: ["user:email"] }),
	function (req, res) {
		// The request will be redirected to GitHub for authentication, so this
		// function will not be called.
	}
)

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
viewRouter.get(
	"/auth/github/callback",
	passport.authenticate("github", { failureRedirect: "/login" }),
	function (req, res) {
		res.redirect("/")
	}
)

viewRouter.use(isAuthenticated)

viewRouter.get("/", async (req, res) => {
	const products = await manager.getProducts()
	res.render("home", { products })
})
viewRouter.get("/logout", async (req, res) => {
	req.logout({},(err)=>{
        console.log(err)
    })
	res.redirect('/login')
})

viewRouter.get("/users", isAdmin, async (req, res) => {
    console.log('esta autenticado',req?.isAuthenticated())
	const users = await userModel.find({}).lean()
	res.render("users", { users })
})

viewRouter.get("/products", async (req, res) => {
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
	console.log(result.docs)

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
	/*console.log("Resumen:", responseObject);*/
})

viewRouter.get("/realtimeproducts", isAdmin, async (req, res) => {
	const products = await productModel.find({}).lean()
	res.render("realtimeproducts", { products })
})

viewRouter.get("/chat", async (req, res) => res.render("chat"))
viewRouter.get("/cart", async (req, res) => res.render("cart"))

export default viewRouter
