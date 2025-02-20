"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/productRoutes.ts
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const productModel_1 = require("../models/productModel");
const router = (0, express_1.Router)();
// Configure multer storage (where to save files)
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Create an 'uploads' folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop()); // Append file extension
    }
});
const upload = (0, multer_1.default)({ storage: storage }); // Create the multer instance
const productModel = new productModel_1.ProductModel();
const index = async (_req, res) => {
    try {
        const products = await productModel.index();
        res.json(products);
    }
    catch (err) {
        res.status(500).json({ error: `Could not retrieve products: ${err}` });
    }
};
const show = async (req, res) => {
    try {
        const product = await productModel.show(req.params.id);
        res.json(product);
    }
    catch (err) {
        res.status(500).json({ error: `Could not find product: ${err}` });
    }
};
const create = async (req, res) => {
    console.log('Request body: ', req.body);
    try {
        const product = await productModel.create(req.body.name, req.body.price, req.body.category);
        res.json(product);
    }
    catch (err) {
        res.status(500).json({ error: `Could not create product: ${err}` });
    }
};
const update = async (req, res) => {
    try {
        const product = await productModel.update(req.params.id, req.body.name, req.body.price, req.body.category);
        res.json(product);
    }
    catch (err) {
        res.status(500).json({ error: `Could not update product: ${err}` });
    }
};
const remove = async (req, res) => {
    try {
        const product = await productModel.delete(req.params.id);
        res.json(product);
    }
    catch (err) {
        res.status(500).json({ error: `Could not delete product: ${err}` });
    }
};
router.get('/', index);
router.get('/:id', show);
router.post('/', upload.any(), create);
router.put('/:id', update);
router.delete('/:id', remove);
exports.default = router;
