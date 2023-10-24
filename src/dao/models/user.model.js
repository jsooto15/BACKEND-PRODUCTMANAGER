import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
import bcrypt from "bcrypt"
const userCollection = "users"

const userSchema = new mongoose.Schema({
	first_name: {
		type: String,
	},
	last_name: {
		type: String,
	},
	email: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
	},
	password: {
		type: String,
	},
	cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
	role: {
		type: String,
		default: "user",
	},
})
userSchema.methods.encryptPassword = (password)=>{
	return bcrypt.hashSync(password, 10)
}
userSchema.methods.comparePassword = function(password){
	return bcrypt.compareSync(password, this.password)
}
userSchema.plugin(mongoosePaginate)
const userModel = mongoose.model(userCollection, userSchema)
export { userModel }
