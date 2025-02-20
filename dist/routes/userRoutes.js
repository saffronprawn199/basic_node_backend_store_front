"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userModel_1 = require("../models/userModel");
const multer_1 = __importDefault(require("multer")); // Import multer
const verifyAuthToken_1 = __importDefault(require("../middleware/verifyAuthToken"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)(); // Create a router instance
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
const userModel = new userModel_1.UserModel();
const index = async (_req, res) => {
    try {
        const users = await userModel.index();
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ error: `Could not retrieve users: ${err}` });
    }
};
const show = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.show(userId);
        if (user) {
            const recentOrders = await userModel.getRecentOrders(userId);
            res.json({ user, recentOrders });
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (err) {
        res.status(500).json({ error: `Could not find user: ${err}` });
    }
};
const create = async (req, res) => {
    try {
        console.log('Request body: ', req.body);
        const user = await userModel.create(req.body.firstName, req.body.lastName, req.body.email, req.body.password);
        // create JWT token
        const token = jsonwebtoken_1.default.sign({ User: user }, process.env.TOKEN_SECRET);
        res.json(token);
    }
    catch (err) {
        res.status(500).json({ error: `Could not create user: ${err}` });
    }
};
const update = async (req, res) => {
    try {
        const user = await userModel.update(req.params.id, req.body.firstName, req.body.lastName, req.body.email, req.body.password);
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ error: `Could not update user: ${err}` });
    }
};
const remove = async (req, res) => {
    try {
        const user = await userModel.delete(req.params.id);
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ error: `Could not delete user: ${err}` });
    }
};
const authenticate = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.authenticate(email, password);
        if (user) {
            const token = jsonwebtoken_1.default.sign({ User: user }, process.env.TOKEN_SECRET);
            res.json(token);
        }
        else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    }
    catch (err) {
        res.status(500).json({ error: `Could not authenticate user: ${err}` });
    }
};
router.post('/test', upload.any(), (req, res) => {
    console.log('Body:', req.body); // Log the text fields
    console.log('Files:', req.files); // Log the files
    res.send('Data received!');
});
router.get('/', verifyAuthToken_1.default, index);
router.get('/:id', verifyAuthToken_1.default, show);
router.post('/', upload.any(), create);
router.put('/:id', verifyAuthToken_1.default, update);
router.delete('/:id', verifyAuthToken_1.default, remove);
router.post('/authenticate', authenticate);
exports.default = router;
