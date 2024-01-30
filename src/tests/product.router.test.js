import supertest from "supertest"
import { expect } from "chai"
const request = supertest("http://127.0.0.1:8080/api")

describe("GET /products", function () {
	it("returns all products, at least 2 of them", async function () {
		const response = await request.get("/products")

		expect(response.status).to.eql(200)
		expect(response.body.length).to.gte(2)
		// done()
	})
})
describe("GET /products/{id}", function () {
	it("returns 1 product bad ID", async function () {
		const response = await request.get("/products/0")

		expect(response.status).to.eql(500)
		// done()
	})
})
