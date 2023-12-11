import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
import { v4 as uuidv4 } from "uuid"
const collection = "tickets"

const ticketSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			unique: true,
		},
		amount: {
			type: Number,
		},
		purchaser: {
			type: String,
		},

	},
	{
		timestamps: {
			createdAt: "purchase_datetime",
		},
	}
)

ticketSchema.pre("save", function (next) {
	this.code=uuidv4()
	next()
})
ticketSchema.plugin(mongoosePaginate)
const ticketModel = mongoose.model(collection, ticketSchema)
export { ticketModel }
