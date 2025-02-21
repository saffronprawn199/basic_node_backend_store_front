import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

const app: express.Application = express();
const address: string = "0.0.0.0:3000";

app.use(bodyParser.json());

// Use user routes
app.use("/users", userRoutes);

// Use product routes
app.use("/products", productRoutes);

// Use order routes
app.use("/orders", orderRoutes);

// Use dashboard routes
app.use("/dashboard", dashboardRoutes);

app.get("/", function (_req: Request, res: Response) {
  res.send("Hello World!");
});

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
