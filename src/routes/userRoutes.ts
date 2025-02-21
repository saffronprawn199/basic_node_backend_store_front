import { Request, Response, Router } from "express";
import { UserModel } from "../models/userModel";
import { User } from "../types/userTypes";
import upload from "../middleware/multerUpload";
import verifyAuthToken from "../middleware/verifyAuthToken";
import jwt from "jsonwebtoken";

const router = Router(); // Create a router instance

const userModel = new UserModel();

const index = async (_req: Request, res: Response) => {
  try {
    const users: User[] = await userModel.index();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: `Could not retrieve users: ${err}` });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as unknown as number;
    const user: User | null = await userModel.show(userId);
    if (user) {
      const recentOrders = await userModel.getRecentOrders(userId);
      res.json({ user, recentOrders });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: `Could not find user: ${err}` });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    console.log("Request body: ", req.body);
    const user: User = await userModel.create(
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.password,
    );

    // create JWT token
    const token = jwt.sign({ User: user }, process.env.TOKEN_SECRET as string);
    res.json(token);
  } catch (err) {
    res.status(500).json({ error: `Could not create user: ${err}` });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const user: User | null = await userModel.update(
      req.params.id as unknown as number,
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.password,
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: `Could not update user: ${err}` });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const user: User | null = await userModel.delete(
      req.params.id as unknown as number,
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: `Could not delete user: ${err}` });
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user: User | null = await userModel.authenticate(email, password);

    if (user) {
      const token = jwt.sign(
        { User: user },
        process.env.TOKEN_SECRET as string,
      );
      res.json(token);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: `Could not authenticate user: ${err}` });
  }
};

router.get("/", verifyAuthToken, index);
router.get("/:id", verifyAuthToken, show);
router.post("/", upload.any(), create);
router.put("/:id", verifyAuthToken, update);
router.delete("/:id", verifyAuthToken, remove);
router.post("/authenticate", authenticate);

export default router;
