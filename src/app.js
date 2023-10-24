import express from "express"
const app = express()
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import mongoose from "mongoose"
import { __dirname } from "./path.js"
const httpServer = app.listen(8080, () => console.log("ACTIVAU"))
const socketServer = new Server(httpServer)
import prodRouter from "./routes/productroute.js"
import cartRouter from "./routes/cartroute.js"
import viewRouter from "./routes/viewsroute.js"
import session from "express-session"
import passport from "passport"
import configPassport from "./auth/local.js"
import ProductManager from "./dao/database/productmanager.js"
const managersocket = new ProductManager()
import MessagesManager from "./dao/database/messagemanager.js"
import userRouter from "./routes/userrouter.js"
import sessionRouter from "./routes/sessionrouter.js"
const messagesocket = new MessagesManager()

mongoose.connect(
	"mongodb+srv://jsooto4:cbfJNXtug3RvHxr8@cluster0.mutkthe.mongodb.net/?retryWrites=true&w=majority"
)
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
//app.use(express.static("./public"))
//app.use(express.static('public'));

app.use((req, res, next) => {
	req.context = { socketServer }
	next()
})

app.use("/api/products", prodRouter)
app.use("/api/carts", cartRouter)
app.use("/api/users", userRouter)
app.use("/api/sessions", sessionRouter)
app.use("/", viewRouter)


socketServer.on("connection", async (socket) => {
	console.log("Cliente conectado con ID:", socket.id)
	const listadeproductos = await managersocket.getProducts()
	socketServer.emit("enviodeproducts", listadeproductos)

	socket.on("addProduct", async (obj) => {
		await managersocket.addProduct(obj)
		const listadeproductos = await managersocket.getProducts()
		socketServer.emit("enviodeproducts", listadeproductos)
	})
	socket.on("newProduct", async (obj) => {
		await managersocket.addProduct(obj)
		const listadeproductos = await managersocket.getProducts()
		socketServer.emit("enviodeproducts", listadeproductos)
	})

	socket.on("deleteProduct", async ({ id }) => {
		console.log(id)
		await managersocket.deleteProduct(id)
		const listadeproductos = await managersocket.getProducts({})
		socketServer.emit("Socket-Products", listadeproductos)
	})

	socket.on("nuevousuario", (usuario) => {
		console.log("usuario", usuario)
		socket.broadcast.emit("broadcast", usuario)
	})
	socket.on("disconnect", () => {
		console.log(`Usuario con ID : ${socket.id} esta desconectado `)
	})

	socket.on("mensaje", async (info) => {
		console.log(info)
		await messagesocket.createMessage(info)

		socketServer.emit("chat", await messagesocket.getMessages())
	})
})

export { passport as pass }


