import { UserModel } from "../userModel";
import { User } from "../../types/userTypes";
import client from "../../database";
import bcrypt from "bcrypt";

const userModel = new UserModel();

describe("User Model", () => {
  beforeAll(async () => {
    // Set up any necessary data or state before tests run
    await client.query("DELETE FROM users");
  });

  it("should create a user", async () => {
    const user: User = await userModel.create(
      "John",
      "Doe",
      "john.doe@example.com",
      "password123",
    );
    expect(user).toEqual(
      jasmine.objectContaining({
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
      }),
    );
    const isPasswordCorrect = await bcrypt.compareSync(
      "password123" + process.env.BCRYPT_PASSWORD,
      user.password,
    );
    expect(isPasswordCorrect).toBeTrue();
  });

  it("should return a list of users", async () => {
    const users = await userModel.index();
    expect(users.length).toBeGreaterThan(0);
  });

  it("should update a user", async () => {
    // delete all users
    await client.query("DELETE FROM users");

    const user: User = await userModel.create(
      "John",
      "Doe",
      "john.doe@example.com",
      "password123",
    );
    const updatedUser = await userModel.update(
      user.id,
      "Jane",
      "Doe",
      "jane.doe@example.com",
      "newpassword123",
    );
    expect(updatedUser).toEqual(
      jasmine.objectContaining({
        first_name: "Jane",
        last_name: "Doe",
        email: "jane.doe@example.com",
      }),
    );
    // delete all users
    await client.query("DELETE FROM users");
  });

  it("should delete a user", async () => {
    const user: User = await userModel.create(
      "John",
      "Doe",
      "john.doe@example.com",
      "password123",
    );
    const deletedUser = await userModel.delete(user.id);
    expect(deletedUser).toEqual(
      jasmine.objectContaining({
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
      }),
    );
  });
});
