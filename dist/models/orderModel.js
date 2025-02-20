"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const database_1 = __importDefault(require("../database"));
class OrderModel {
    async create(userId, status) {
        try {
            const sql = 'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *';
            const result = await database_1.default.query(sql, [userId, status]);
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not create order: ${err}`);
        }
    }
    async addProduct(orderId, productId, quantity) {
        try {
            const sql = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';
            const result = await database_1.default.query(sql, [orderId, productId, quantity]);
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`);
        }
    }
    async show(orderId) {
        try {
            const sql = 'SELECT * FROM orders WHERE id = $1';
            const result = await database_1.default.query(sql, [orderId]);
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find order ${orderId}: ${err}`);
        }
    }
    async index() {
        try {
            const sql = 'SELECT * FROM orders';
            const result = await database_1.default.query(sql);
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get orders: ${err}`);
        }
    }
}
exports.OrderModel = OrderModel;
