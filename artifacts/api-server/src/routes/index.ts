import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import categoriesRouter from "./categories";
import productsRouter from "./products";
import cartRouter from "./cart";
import ordersRouter from "./orders";
import adminRouter from "./admin";
import uploadRouter from "./upload";
import razorpayRouter from "./razorpay";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/categories", categoriesRouter);
router.use("/products", productsRouter);
router.use("/cart", cartRouter);
router.use("/orders", ordersRouter);
router.use("/admin", adminRouter);
router.use("/upload", uploadRouter);
router.use("/razorpay", razorpayRouter);

export default router;
