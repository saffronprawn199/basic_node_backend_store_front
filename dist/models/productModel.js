"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const database_1 = __importDefault(require("../database"));
class ProductModel {
    async create(name, price, category) {
        console.log('Creating product: ', name, price, category);
        try {
            const result = await database_1.default.query('INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *', [name, price, category]);
            console.log('Result: ', result.rows[0]);
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not create product: ${err}`);
        }
    }
    async show(id) {
        try {
            const result = await database_1.default.query('SELECT * FROM products WHERE id = $1', [id]);
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find product ${id}: ${err}`);
        }
    }
    async index() {
        try {
            const result = await database_1.default.query('SELECT * FROM products');
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get products: ${err}`);
        }
    }
    async update(id, name, price, category) {
        try {
            const result = await database_1.default.query('UPDATE products SET name = $1, price = $2, category = $3 WHERE id = $4 RETURNING *', [name, price, category, id]);
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not update product ${id}: ${err}`);
        }
    }
    async delete(id) {
        try {
            const result = await database_1.default.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not delete product ${id}: ${err}`);
        }
    }
}
exports.ProductModel = ProductModel;
