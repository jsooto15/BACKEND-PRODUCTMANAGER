import express from "express"
const app = express()
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import mongoose from "mongoose"
//import 'dotenv/config'
import { __dirname } from "./src/path.js"
const httpServer = app.listen(3000, "0.0.0.0",() => {
	console.log(`Docs are available on http://localhost:3000/api/docs`)
})
const socketServer = new Server(httpServer)
import prodRouter from "./src/routes/productroute.js"
import cartRouter from "./src/routes/cartroute.js"
import viewRouter from "./src/routes/viewsroute.js"
import session from "express-session"
import passport from "passport"
import winston from "winston"
import configPassport from "./src/auth/local.js"
import Product from "./src/dao/classes/product.dao.js"
const productService = new Product()
import Message from "./src/dao/classes/message.dao.js"
import userRouter from "./src/routes/userrouter.js"
import sessionRouter from "./src/routes/sessionrouter.js"
import "./src/config.js"
const messageService = new Message()

const levels = {
	fatal: 0,
	error: 1,
	warning: 2,
	info: 3,
	http: 4,
	debug: 5,
}
const alignedWithColorsAndTime = winston.format.combine(
	winston.format.colorize({
		colors: { info: "green", fatal: "red", warning: "yellow", http: "blue" },
	}),
	winston.format.timestamp(),
	winston.format.printf(
		(info) => `${info.timestamp} ${info.level}: ${info.message}`
	)
)
let logger
if (process.env.NODE_ENV !== "production") {
	logger = winston.createLogger({
		level: "debug",
		levels,
		format: winston.format.json(),
		transports: [
			new winston.transports.Console({
				format: alignedWithColorsAndTime,
			}),
		],
	})
} else {
	logger = winston.createLogger({
		level: "info",
		levels,
		format: winston.format.json(),
		transports: [
			new winston.transports.File({ filename: "errors.log", level: "error" }),
			new winston.transports.File({ filename: "combined.log" }),
			new winston.transports.Console({
				format: alignedWithColorsAndTime,
			}),
		],
	})
}

try {
	configPassport(passport)
	app.use(
		session({
			secret: "mysecretpass",
			resave: false,
			saveUninitialized: false,
		})
	)
	app.use(passport.initialize())
	app.use(passport.session())
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))
	app.use(express.static(__dirname + "/public"))
	app.engine("handlebars", handlebars.engine())
	app.use(express.static(__dirname + "/public"))
	app.set("view engine", "handlebars")
	app.set("views", __dirname + "/views")
} catch (err) {
	logger.fatal(err?.message)
}

//app.use(express.static("./public"))
//app.use(express.static('public'));

app.use((req, res, next) => {
	req.context = { socketServer }
	logger.http(`METHOD: ${req.method} - REQUESTED URL: ${req.url.slice(1) || "/"}`)
	next()
})

app.use("/api/products", prodRouter)
app.use("/api/carts", cartRouter)
app.use("/api/users", userRouter)
app.use("/api/sessions", sessionRouter)
app.use("/", viewRouter)

socketServer.on("connection", async (socket) => {
	logger.debug("Cliente conectado con ID:", socket.id)
	const listadeproductos = await productService.getProducts()
	socketServer.emit("enviodeproducts", listadeproductos)

	socket.on("updateProductList", async (obj) => {
		const listadeproductos = await productService.getProducts()
		socketServer.emit("enviodeproducts", listadeproductos)
	})
	socket.on("newProduct", async (obj) => {
		await productService.addProduct(obj)
		const listadeproductos = await productService.getProducts()
		socketServer.emit("enviodeproducts", listadeproductos)
	})

	socket.on("deleteProduct", async ({ id }) => {
		logger.debug(id)
		await productService.deleteProduct(id)
		const listadeproductos = await productService.getProducts({})
		socketServer.emit("Socket-Products", listadeproductos)
	})

	socket.on("nuevousuario", (usuario) => {
		logger.debug("usuario", usuario)
		socket.broadcast.emit("broadcast", usuario)
	})
	socket.on("disconnect", () => {
		logger.debug(`Usuario con ID : ${socket.id} esta desconectado `)
	})

	socket.on("mensaje", async (info) => {
		logger.debug(info)
		await messageService.createMessage(info)

		socketServer.emit("chat", await messageService.getMessages())
	})
})

export { passport as pass, logger }
