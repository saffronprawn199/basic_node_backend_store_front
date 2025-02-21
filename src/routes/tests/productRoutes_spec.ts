import supertest from "supertest";
import app from "../../server";

const request = supertest(app);

describe("Product Routes", () => {
  let productId: number;

  it("should create a new product", async () => {
    const response = await request.post("/products").send({
      name: "Test Product",
      price: 100,
      category: "Test Category",
    });
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
    productId = response.body.id;
  });

  it("should get a list of products", async () => {
    const response = await request.get("/products");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a product by ID", async () => {
    const response = await request.get(`/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  });

  it("should update a product", async () => {
    const response = await request.put(`/products/${productId}`).send({
      name: "Updated Product",
      price: 150,
      category: "Updated Category",
    });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Updated Product");
  });

  it("should delete a product", async () => {
    const response = await request.delete(`/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  });
});
