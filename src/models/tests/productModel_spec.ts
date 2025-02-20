import { ProductModel } from '../productModel';
import { Product } from '../../types/productTypes';
import client from '../../database';

const productModel = new ProductModel();

describe('Product Model', () => {
    beforeAll(async () => {
        // Set up any necessary data or state before tests run
        await client.query('DELETE FROM products');
    });

    it('should create a product', async () => {
        const product: Product = await productModel.create('Test Product', 100, 'Test Category');
        expect(product).toEqual(jasmine.objectContaining({
            name: 'Test Product',
            price: '100.00',
            category: 'Test Category'
        }));
    });

    it('should return a list of products', async () => {
        
        // just populate data base with superfluous values.
        for (let i = 0; i < 2; i++) {
            let _ = await productModel.create(`Test Produc-${i}`, parseInt(`${i}`), `Test Category-${i}`);
        }
        const products = await productModel.index();
        expect(products.length).toBeGreaterThan(0);
        // delete all products
        await client.query('DELETE FROM products');
    });

    it('should update a product', async () => {

        const product: Product = await productModel.create('Test Product', 100, 'Test Category');
        const updatedProduct = await productModel.update(product.id , 'Updated Product', 150, 'Updated Category');
        expect(updatedProduct).toEqual(jasmine.objectContaining({
            name: 'Updated Product',
            price: '150.00',
            category: 'Updated Category'
        }));
        // delete all products
        await client.query('DELETE FROM products');
    });

    it('should delete a product', async () => {
        //  create moc product
        const product: Product = await productModel.create('Test Product', 100, 'Test Category');
        const deletedProduct = await productModel.delete(product.id);
        expect(deletedProduct).toEqual(jasmine.objectContaining({
            name: 'Test Product',
            price: '100.00',
            category: 'Test Category'
        }));
        // delete all products
        await client.query('DELETE FROM products');
    });
});
