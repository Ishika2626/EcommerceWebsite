import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { cartItemsTable, productsTable } from "@workspace/db/schema";
import { eq, inArray } from "drizzle-orm";

const router: IRouter = Router();

const COD_CHARGE_PER_ITEM = 200;

router.get("/config", async (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  res.json({ keyId: keyId || null, configured: !!keyId });
});

router.post("/create-order", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    res.status(503).json({ error: "Payment gateway not configured" });
    return;
  }

  try {
    const { paymentMethod } = req.body;

    const cartItems = await db
      .select({ id: cartItemsTable.id, productId: cartItemsTable.productId, quantity: cartItemsTable.quantity })
      .from(cartItemsTable)
      .where(eq(cartItemsTable.userId, userId));

    if (cartItems.length === 0) {
      res.status(400).json({ error: "Cart is empty" });
      return;
    }

    const productIds = cartItems.map(i => i.productId);
    const products = await db.select().from(productsTable).where(inArray(productsTable.id, productIds));
    const productMap = Object.fromEntries(products.map(p => [p.id, p]));

    const subtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(productMap[item.productId]?.price || "0");
      return sum + price * item.quantity;
    }, 0);

    const codCharge = paymentMethod === "cod" ? cartItems.length * COD_CHARGE_PER_ITEM : 0;
    const amountToPay = paymentMethod === "cod" ? codCharge : subtotal;

    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amountToPay * 100),
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: amountToPay,
      currency: "INR",
      keyId,
    });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to create payment order" });
  }
});

export default router;
