import client from "../database";
import { Order, OrderProduct } from "../types/orderTypes";

export class OrderModel {
  async create(userId: number, status: string): Promise<Order> {
    try {
      const sql =
        "INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *";
      const result = await client.query(sql, [userId, status]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create order: ${err}`);
    }
  }

  async addProduct(
    orderId: number,
    productId: number,
    quantity: number,
  ): Promise<OrderProduct> {
    try {
      const sql =
        "INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *";
      const result = await client.query(sql, [orderId, productId, quantity]);
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not add product ${productId} to order ${orderId}: ${err}`,
      );
    }
  }

  async show(orderId: number): Promise<Order | null> {
    try {
      const sql = "SELECT * FROM orders WHERE id = $1";
      const result = await client.query(sql, [orderId]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find order ${orderId}: ${err}`);
    }
  }

  async index(): Promise<Order[]> {
    try {
      const sql = "SELECT * FROM orders";
      const result = await client.query(sql);
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders: ${err}`);
    }
  }

  async delete(id: number): Promise<Order | null> {
    try {
      const result = await client.query(
        "DELETE FROM orders WHERE id = $1 RETURNING *",
        [id],
      );
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete order ${id}: ${err}`);
    }
  }
}
