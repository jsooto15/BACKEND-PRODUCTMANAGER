import { messageModel } from "../models/message.model.js"

export default class Message {
	//Muestra los mensajes
	getMessages = async () => {
		try {
			return await messageModel.find().lean()
		} catch (error) {
			return error
		}
	}
	//Crea un mesaje
	createMessage = async (message) => {
		try {
			return await messageModel.create(message)
		} catch (error) {
			return error
		}
	}
}
