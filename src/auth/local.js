import {Strategy as LocalStrategy} from "passport-local"
import { Strategy as GitHubStrategy } from "passport-github2"
import { userModel } from "../dao/models/user.model.js"
import Cart from "../dao/classes/cart.dao.js"
import { logger } from "../../index.js"

const GITHUB_CLIENT_ID = "eaf32c15ff07bc4568f3"
const GITHUB_CLIENT_SECRET = "ff59aaf3705664df5b06d26c9dc2aa6d287fb611"

export default (passport) => {
	passport.serializeUser((user, done) => {
		done(null, user.id)
	})
	passport.deserializeUser(async(id, done) => {
        const user = await userModel.findById(id)
		done(null, user)
	})
	passport.use(
		"local-login",
		new LocalStrategy(
			{
				usernameField: "email",
				passwordField: "pass",
			},
			async (email, password, cb) => {
                logger.info(email, password)
				try {
					const user = await userModel.findOne({ email })
					if (!user) {
						return cb(null, false, { message: "Credenciales inválidas" })
					}
					if (!user.comparePassword(password)) {
						return cb(null, false, { message: "Credenciales inválidas" })
					}
					return cb(null, user)
				} catch (err) {
					return cb(err)
				}
			}
		)
	)
	passport.use(
		"local-register",
		new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pass',
        passReqToCallback:true,
    },
    async (req, email, password, done) => {
			try {
				const duplicateUser = await userModel.findOne({ email })
				if (duplicateUser) {
					return done(null, false, {
						message: "Este correo se encuentra registrado",
					})
				}
				const user = new userModel()
				const cartService = new Cart()
				const cartId = await cartService.addCart()
				user.email = email
				user.password = user.encryptPassword(password)
				user.first_name = req.body.firstName
				user.last_name = req.body.lastName
				user.age = req.body.age
				user.role = req.body.role
				user.cart = cartId
				await user.save()
				return done(null, user)
			} catch (err) {
				return done(err)
			}
		})
	)
	passport.use('github',
		new GitHubStrategy(
			{
				clientID: GITHUB_CLIENT_ID,
				clientSecret: GITHUB_CLIENT_SECRET,
				callbackURL: "http://127.0.0.1:8080/auth/github/callback",
			},
			function (accessToken, refreshToken, profile, done) {
				// asynchronous verification, for effect...
				process.nextTick(async function () {
					// To keep the example simple, the user's GitHub profile is returned to
					// represent the logged-in user.  In a typical application, you would want
					// to associate the GitHub account with a user record in your database,
					// and return that user instead.
					let user = await userModel.findOne({email:profile?.username})
					if(!user){
						const cartService = new Cart()
						const cartId = await cartService.addCart()
						user = new userModel()
						user.first_name = profile?.displayName
						user.email = profile?.username
						user.role = 'user'
						user.cart = cartId
						await user.save()
					}
					logger.info('perfil de github',profile)
					return done(null, user)
				})
			}
		)
	)
}
