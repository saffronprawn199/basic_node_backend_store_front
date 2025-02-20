import { Request, Response, Router } from 'express';
import { OrderModel } from '../models/orderModel';
import { Order } from '../types/orderTypes';
import verifyAuthToken from '../middleware/verifyAuthToken';

const router = Router();
const orderModel = new OrderModel();

const index = async (_req: Request, res: Response) => {
    try {
        const orders: Order[] = await orderModel.index();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: `Could not retrieve orders: ${err}` });
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const order: Order | null = await orderModel.show(req.params.id as unknown as number);
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: `Could not find order: ${err}` });
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const { userId, status } = req.body;
        const order: Order = await orderModel.create(userId, status);
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: `Could not create order: ${err}` });
    }
};

const addProduct = async (req: Request, res: Response) => {
    try {
        const { productId, quantity } = req.body;
        const orderProduct = await orderModel.addProduct(req.params.id as unknown as number, productId, quantity);
        res.json(orderProduct);
    } catch (err) {
        res.status(500).json({ error: `Could not add product to order: ${err}` });
    }
};

router.get('/', verifyAuthToken, index);
router.get('/:id', verifyAuthToken, show);
router.post('/', verifyAuthToken, create);
router.post('/:id/products', verifyAuthToken, addProduct);

export default router; 