import client from "../database";
import { Product } from "../types/productTypes";

export class ProductModel {
  async create(
    name: string,
    price: number,
    category?: string,
  ): Promise<Product> {
    console.log("Creating product: ", name, price, category);
    try {
      const result = await client.query(
        "INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *",
        [name, price, category],
      );
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create product: ${err}`);
    }
  }

  async show(id: number): Promise<Product | null> {
    try {
      const result = await client.query(
        "SELECT * FROM products WHERE id = $1",
        [id],
      );
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find product ${id}: ${err}`);
    }
  }

  async index(): Promise<Product[]> {
    try {
      const result = await client.query("SELECT * FROM products");
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products: ${err}`);
    }
  }

  async update(
    id: number,
    name: string,
    price: number,
    category?: string,
  ): Promise<Product | null> {
    try {
      const result = await client.query(
        "UPDATE products SET name = $1, price = $2, category = $3 WHERE id = $4 RETURNING *",
        [name, price, category, id],
      );
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not update product ${id}: ${err}`);
    }
  }

  async delete(id: number): Promise<Product | null> {
    try {
      const result = await client.query(
        "DELETE FROM products WHERE id = $1 RETURNING *",
        [id],
      );
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete product ${id}: ${err}`);
    }
  }
}
