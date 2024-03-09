import { testClient } from "hono/testing";
import latestActionRoute from "src/routes/api/latest-route";

test("test", async () => {
	const res: typeof latestActionRoute =
		await testClient(latestActionRoute).search.$get();

	expect(await res.json()).toEqual({ hello: "world" });
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
