import supertest from "supertest";
import app from "../../server";

const request = supertest(app);

describe("Order Routes", () => {
  let token: string;
  let orderId: number;
  let userId: number;
  let productId: number;

  beforeAll(async () => {
    const response = await request.post("/users").send({
      firstName: "Test",
      lastName: "User",
      email: "test.user@example.com",
      password: "password123",
    });
    console.log(response.body);
    token = response.body;

    // get userID from show index
    const response_index = await request
      .get("/users")
      .set("Authorization", `Bearer ${token}`);
    // set userId to the first user in the response
    userId = response_index.body[0].id;

    // create a product
    const response_create_product = await request.post("/products").send({
      name: "Test Product",
      price: 100,
      category: "Test Category",
    });

    // index of products
    const response_index_product = await request.get("/products");
    expect(response_index_product.status).toBe(200);
    expect(response_index_product.body.length).toBeGreaterThan(0);
    productId = response_index_product.body[0].id;
  });

  it("should create a new order", async () => {
    const response = await request
      .post("/orders")
      .send({
        userId: userId,
        status: "active",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
    orderId = response.body.id;
  });

  it("should get a list of orders", async () => {
    const response = await request
      .get("/orders")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get an order by ID", async () => {
    const response = await request
      .get(`/orders/${orderId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  });

  it("should add a product to an order", async () => {
    const response = await request
      .post(`/orders/${orderId}/products`)
      .send({
        productId: productId,
        quantity: 10,
      })
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  });
});
