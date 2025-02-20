"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPopularProducts = void 0;
const database_1 = __importDefault(require("../database"));
const getPopularProducts = async () => {
    try {
        const sql = `
            SELECT product_id, COUNT(product_id) AS count
            FROM order_products
            GROUP BY product_id
            ORDER BY count DESC
            LIMIT 5
        `;
        const result = await database_1.default.query(sql);
        return result.rows;
    }
    catch (err) {
        throw new Error(`Could not get popular products: ${err}`);
    }
};
exports.getPopularProducts = getPopularProducts;
