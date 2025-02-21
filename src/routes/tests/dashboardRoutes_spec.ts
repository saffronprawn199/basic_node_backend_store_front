import supertest from "supertest";
import app from "../../server";

const request = supertest(app);

describe("Dashboard Routes", () => {
  let token: string;

  beforeAll(async () => {
    const response = await request.post("/users").send({
      firstName: "Test_1",
      lastName: "User_1",
      email: "test_1.user_1@example.com",
      password: "password123",
    });
    token = response.body;
  });

  it("should get popular products", async () => {
    const response = await request
      .get("/dashboard/popular-products")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  });
});
