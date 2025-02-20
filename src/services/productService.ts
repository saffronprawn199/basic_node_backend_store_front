import client from '../database';

export const getPopularProducts = async (): Promise<{ productId: number; count: number }[]> => {
    try {
        const sql = `
            SELECT product_id, COUNT(product_id) AS count
            FROM order_products
            GROUP BY product_id
            ORDER BY count DESC
            LIMIT 5
        `;
        const result = await client.query(sql);
        return result.rows;
    } catch (err) {
        throw new Error(`Could not get popular products: ${err}`);
    }
}; 