"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderModel_1 = require("../models/orderModel");
const verifyAuthToken_1 = __importDefault(require("../middleware/verifyAuthToken"));
const router = (0, express_1.Router)();
const orderModel = new orderModel_1.OrderModel();
const index = async (_req, res) => {
    try {
        const orders = await orderModel.index();
        res.json(orders);
    }
    catch (err) {
        res.status(500).json({ error: `Could not retrieve orders: ${err}` });
    }
};
const show = async (req, res) => {
    try {
        const order = await orderModel.show(req.params.id);
        res.json(order);
    }
    catch (err) {
        res.status(500).json({ error: `Could not find order: ${err}` });
    }
};
const create = async (req, res) => {
    try {
        const { userId, status } = req.body;
        const order = await orderModel.create(userId, status);
        res.json(order);
    }
    catch (err) {
        res.status(500).json({ error: `Could not create order: ${err}` });
    }
};
const addProduct = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const orderProduct = await orderModel.addProduct(req.params.id, productId, quantity);
        res.json(orderProduct);
    }
    catch (err) {
        res.status(500).json({ error: `Could not add product to order: ${err}` });
    }
};
router.get('/', verifyAuthToken_1.default, index);
router.get('/:id', verifyAuthToken_1.default, show);
router.post('/', verifyAuthToken_1.default, create);
router.post('/:id/products', verifyAuthToken_1.default, addProduct);
exports.default = router;
