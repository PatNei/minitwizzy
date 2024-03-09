import app from "src/routes/api/latest-route.js";

process.env.DB_TESTING = "true";

test("test", async () => {
	const res = await app.request("/");
	expect(await res.json()).toEqual({ hello: -1 });
});
describe("Example", () => {
	test("GET /posts", async () => {
		const res = await app.request("/posts");
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("Many posts");
	});
});

describe("Example", () => {
	test("POST /posts", async () => {
		const req = new Request("http://localhost/posts", {
			method: "POST",
		});
		const res = await app.request(req);
		expect(res.status).toBe(201);
		expect(res.headers.get("X-Custom")).toBe("Thank you");
		expect(await res.json()).toEqual({
			message: "Created",
		});
	});
});
