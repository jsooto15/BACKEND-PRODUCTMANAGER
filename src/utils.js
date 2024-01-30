import { fakerES as faker } from "@faker-js/faker"
import nodeMailer from 'nodemailer'

// const EMAIL = process.env.EMAIL
// const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD
// const EMAIL_HOST = process.env.EMAIL_HOST
// const EMAIL_PORT = process.env.EMAIL_PORT

export const generateUser = () => {
	let numOfProducts = faker.number.int({ min: 1, max: 20 })
	let products = []
	for (let i = 0; i < numOfProducts; i++) {
		products.push(generateProduct())
	}
	return {
		first_name: faker.person.firstName(),
		last_name: faker.person.lastName(),
		email: faker.internet.email(),
		age: faker.number.int({ min: 15, max: 80 }),
		password: faker.internet.password(),
		role: faker.helpers.arrayElement(["cliente", "vendedor"]),
		job: faker.person.jobTitle(),
		premium: faker.datatype.boolean(),
		products,
	}
}
export const generateProduct = () => {
	return {
		title: faker.commerce.productName(),
		description: faker.commerce.productDescription(),
		price: faker.commerce.price(),
		stock: faker.number.int({ min: 15, max: 100 }),
		thumbnail: faker.image.urlLoremFlickr({ category: "product" }),
		code: faker.database.mongodbObjectId(),
		category: faker.commerce.department(),
		status: faker.helpers.arrayElement(["active", "inactive"]),
	}
}
export const enviarCorreoRecuperacion = async (link, email)=>{
	const html = `<h1>Hello there</h1>
				<p>Here is your link to recover your password</p>
				<a href="${link}">Reestablecer contraseña</a>
	`

	nodeMailer.createTestAccount(async (err, account) => {
		// create reusable transporter object using the default SMTP transport
		let transporter = nodeMailer.createTransport({
			host: "smtp.ethereal.email",
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: account.user, // generated ethereal user
				pass: account.pass, // generated ethereal password
			},
		})
		const info = await transporter.sendMail({
			from:`Product Manager <${account.user}>`,
			to: email,
			subject:'Testing purposes',
			html
		})
		console.log("Message sent: " + info.messageId)
		console.log("Preview URL: " + nodeMailer.getTestMessageUrl(info))
	})


}
export const enviarCorreoProducto = async (prodName, email)=>{
	const html = `<h1>Hola</h1>
				<p>tu producto ${prodName} acaba de ser eliminado</p>
	`

	nodeMailer.createTestAccount(async (err, account) => {
		// create reusable transporter object using the default SMTP transport
		let transporter = nodeMailer.createTransport({
			host: "smtp.ethereal.email",
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: account.user, // generated ethereal user
				pass: account.pass, // generated ethereal password
			},
		})
		const info = await transporter.sendMail({
			from:`Product Manager <${account.user}>`,
			to: email,
			subject:'Inventory',
			html
		})
		console.log("Message sent: " + info.messageId)
		console.log("Preview URL: " + nodeMailer.getTestMessageUrl(info))
	})


}
