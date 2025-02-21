import supertest from "supertest";
import app from "../../server";

const request = supertest(app);

describe("User Routes", () => {
  let token: string;
  let userId: number;

  it("should create a new user", async () => {
    const response = await request.post("/users").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example_1.com",
      password: "password123",
    });
    token = response.body;
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
    userId = response.body.id;
  });

  it("should get a list of users", async () => {
    const response = await request
      .get("/users")
      .set("Authorization", `Bearer ${token}`);
    // set userId to the first user in the response
    userId = response.body[0].id;
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a user by ID", async () => {
    const response = await request
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  });

  it("should update a user", async () => {
    const response = await request
      .put(`/users/${userId}`)
      .send({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        password: "newpassword123",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.first_name).toBe("Jane");
  });

  it("should delete a user", async () => {
    const response = await request
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  });
});
