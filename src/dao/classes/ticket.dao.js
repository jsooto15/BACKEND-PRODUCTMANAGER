import { logger } from "../../app.js"
import { ticketModel } from "../models/ticket.model.js"
export default class Ticket {
	//Muestra los productos
	getTickets = async () => {
		const tickets = await ticketModel.find({}).lean()
		logger.info(tickets)
		return tickets
	}
	//Muestra un usuario por su id
	getTicketById = async (id) => {
		const ticket = await ticketModel.find({ _id: id }).lean()
		return ticket
	}
	//Agregando producto
	addTicket = async (newTicket) => {
		try {
			const ticket = await ticketModel.create({ ...newTicket })
			logger.info("created ticket", ticket)
			return ticket
		} catch (error) {
			logger.info(error)
		}
	}
	//Actualiza un producto
	updateTicket = async (id, obj) => {
		await ticketModel.updateOne({ _id: id }, obj).lean()
		return obj
	}
	//Elimina un producto
	deleteTicket = async (id) => {
		try {
			const ticket = await ticketModel.findByIdAndDelete(id)
			return ticket
		} catch (error) {
			logger.info(error)
		}
	}
}
