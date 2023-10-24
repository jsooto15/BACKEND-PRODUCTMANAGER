import { userModel } from "../models/user.model.js"
import CartManager from "./cartmanager.js"
export default class UserManager {
	//Muestra los productos
	async getUsers() {
		const users = await userModel.find({}).lean()
		console.log(users)
		return users
	}
	//Muestra un usuario por su id
	async getUserById(id) {
		const user = await userModel.find({ _id: id }).lean()
		return user
	}
	//Muestra un usuario por su correo
	async getUserByEmail(email) {
		const user = await userModel.find({ email }).lean()
		return user
	}
	//Agregando producto
	async addUser(newUser) {
		const repeatCode = await userModel.find({ email: newUser.email })
		if (repeatCode) {
			console.log("Codigo invalido")
			return
		}
		try {
			
			const user = await userModel.create({...newUser, cart:cartId})
			console.log('created user', user)
			return user
		} catch (error) {
			console.log(error)
		}
	}
	//Actualiza un producto
	async updateUser(id, obj) {
		await userModel.updateOne({ _id: id }, obj).lean()
		return obj
	}
	//Elimina un producto
	async deleteUser(id) {
		try {
			const user = await userModel.findByIdAndDelete(id)
			return user
		} catch (error) {
			console.log(error)
		}
	}
}