"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productService_1 = require("../services/productService");
const verifyAuthToken_1 = __importDefault(require("../middleware/verifyAuthToken"));
const router = (0, express_1.Router)();
const popularProducts = async (_req, res) => {
    try {
        const products = await (0, productService_1.getPopularProducts)();
        res.json(products);
    }
    catch (err) {
        res.status(500).json({ error: `Could not retrieve popular products: ${err}` });
    }
};
router.get('/popular-products', verifyAuthToken_1.default, popularProducts);
exports.default = router;
