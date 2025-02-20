import { Request, Response, Router } from 'express';
import { getPopularProducts } from '../services/productService';
import verifyAuthToken from '../middleware/verifyAuthToken';

const router = Router();

const popularProducts = async (_req: Request, res: Response) => {
    try {
        const products = await getPopularProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: `Could not retrieve popular products: ${err}` });
    }
};

router.get('/popular-products', verifyAuthToken, popularProducts);

export default router; 