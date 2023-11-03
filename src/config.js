import mongoose from "mongoose"
import 'dotenv/config'

mongoose.connect(
	`mongodb+srv://${process.env['MONGO_USENAME']}:${process.env['MONGO_PASSWORD']}@${process.env['MONGO_HOSTNAME']}/?retryWrites=true&w=majority`
)