import supertest from "supertest"
import { expect } from "chai"
const request = supertest("http://127.0.0.1:8080/api")

describe("GET /carts", function () {
	it("returns all carts, at least 2 of them", async function () {
		const response = await request.get("/carts")

		expect(response.status).to.eql(200)
		expect(response.body.length).to.gte(2)
		// done()
	})
})
describe("GET /carts/{id}", function () {
	it("returns 1 cart bad ID", async function () {
		const response = await request.get("/carts/0")

		expect(response.status).to.eql(500)
		// done()
	})
})
describe("POST /carts", function () {
	it("returns 1 created cart", async function () {
		const payload = {products:[]}
		const response = await request
			.post("/carts")
			.send(payload)
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")

		expect(response.status).to.eql(201)
		// done()
	})
})
describe("PUT /carts", function () {
	it("returns 1 updated cart BAD ID", async function () {
		const payload = {products:[]}
		const response = await request
			.put("/carts/0")
			.send(payload)
			.set("Content-Type", "application/json")
			.set("Accept", "application/json")

		expect(response.status).to.eql(500)
		// done()
	})
})
