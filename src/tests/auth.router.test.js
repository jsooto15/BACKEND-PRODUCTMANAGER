import supertest from "supertest"
import { expect } from "chai"
const request = supertest("http://127.0.0.1:8080")

describe("GET AuthView LOGIN", function () {
	it("returns login's view", async function () {
		const response = await request.get("/login")
		expect(response.status).to.eql(200)
		// done()
	})
})
describe("GET AuthView REGISTER", function () {
	it("returns register's view", async function () {
		const response = await request.get("/register")
		expect(response.status).to.eql(200)
		// done()
	})
})
describe("GET View Home redirection for no AUTH", function () {
	it("returns register's view", async function () {
		const response = await request.get("/")
		expect(response.status).to.eql(302)
		// done()
	})
})
