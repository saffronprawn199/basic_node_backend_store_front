import { OrderModel } from '../orderModel';
import { Order } from '../../types/orderTypes';
import client from '../../database';

const orderModel = new OrderModel();

describe('Order Model', () => {
    beforeEach(async () => {
        // Clear the orders and users tables before each test
        await client.query('DELETE FROM order_products');
        await client.query('DELETE FROM orders');
        await client.query('DELETE FROM users');

        // Insert a user to satisfy foreign key constraints
        await client.query('INSERT INTO users (id, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5)', [1, 'Test', 'User', 'test.user@example.com', 'password123']);
    });

    it('should create an order', async () => {
        const order: Order = await orderModel.create(1, 'active');
        expect(order).toEqual(jasmine.objectContaining({
            user_id: 1,
            status: 'active'
        }));
    });

    it('should return a list of orders', async () => {
        await orderModel.create(1, 'active');
        const orders = await orderModel.index();
        expect(orders.length).toBeGreaterThan(0);
    });

    it('should return the correct order', async () => {
        const createdOrder = await orderModel.create(1, 'active');
        const order = await orderModel.show(createdOrder.id);
        expect(order).toEqual(jasmine.objectContaining({
            user_id: 1,
            status: 'active'
        }));
    });

    it('should add a product to an order', async () => {
        const createdOrder = await orderModel.create(1, 'active');
        // Assuming a product with id 1 exists
        await client.query('INSERT INTO products (id, name, price, category) VALUES ($1, $2, $3, $4)', [1, 'Test Product', 100, 'Test Category']);
        const orderProduct = await orderModel.addProduct(createdOrder.id, 1, 10);
        expect(orderProduct).toEqual(jasmine.objectContaining({
            order_id: createdOrder.id,
            product_id: 1,
            quantity: 10
        }));
    });

    it('should delete an order', async () => {
        const createdOrder = await orderModel.create(1, 'active');
        const deletedOrder = await orderModel.delete(createdOrder.id);
        expect(deletedOrder).toEqual(jasmine.objectContaining({
            user_id: 1,
            status: 'active'
        }));
    });
});
