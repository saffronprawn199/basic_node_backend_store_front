// src/routes/productRoutes.ts
import { Request, Response, Router } from 'express';
import upload from '../middleware/multerUpload';
import { ProductModel } from '../models/productModel';
import { Product } from '../types/productTypes';

const router = Router();
  
const productModel = new ProductModel();

const index = async (_req: Request, res: Response) => {
    try {
        const products: Product[] = await productModel.index();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: `Could not retrieve products: ${err}` });
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const product: Product | null = await productModel.show(req.params.id as unknown as number);
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: `Could not find product: ${err}` });
    }
};

const create = async (req: Request, res: Response) => {
    console.log('Request body: ', req.body);
    try {
        const product: Product = await productModel.create(req.body.name, req.body.price, req.body.category);
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: `Could not create product: ${err}` });
    }
};

const update = async (req: Request, res: Response) => {
    try {
        const product: Product | null = await productModel.update(req.params.id as unknown as number, req.body.name, req.body.price, req.body.category);
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: `Could not update product: ${err}` });
    }
};

const remove = async (req: Request, res: Response) => {
    try {
        const product: Product | null = await productModel.delete(req.params.id as unknown as number);
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: `Could not delete product: ${err}` });
    }
};

router.get('/', index);
router.get('/:id', show);
router.post('/',upload.any(), create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;