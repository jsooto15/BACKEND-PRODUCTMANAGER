import supertest from "supertest"
import { expect } from "chai"
const request = supertest("http://127.0.0.1:8080/api")

describe("GET /sessions/current no Auth", function () {
	it("returns all products, at least 2 of them", async function () {
		const response = await request.get("/sessions/current")

		expect(response.status).to.eql(302)
		// done()
	})
})
