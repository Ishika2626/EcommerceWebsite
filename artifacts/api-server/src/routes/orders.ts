import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ordersTable, cartItemsTable, productsTable, usersTable } from "@workspace/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import crypto from "crypto";

const router: IRouter = Router();

const COD_CHARGE_PER_ITEM = 200;

function serializeOrder(o: any, userName?: string) {
  return {
    ...o,
    userName,
    subtotal: parseFloat(o.subtotal),
    codCharge: parseFloat(o.codCharge),
    total: parseFloat(o.total),
  };
}

router.get("/", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }
  try {
    const orders = await db.select().from(ordersTable)
      .where(eq(ordersTable.userId, userId))
      .orderBy(desc(ordersTable.createdAt));
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    res.json(orders.map(o => serializeOrder(o, user?.name)));
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }
  try {
    const { paymentMethod, shippingAddress, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!paymentMethod || !shippingAddress) {
      res.status(400).json({ error: "paymentMethod and shippingAddress are required" });
      return;
    }

    // Verify Razorpay payment if keys are configured
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (keySecret && razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");
      if (generatedSignature !== razorpaySignature) {
        res.status(400).json({ error: "Invalid payment signature" });
        return;
      }
    }

    const cartItems = await db
      .select({ id: cartItemsTable.id, productId: cartItemsTable.productId, quantity: cartItemsTable.quantity, size: cartItemsTable.size, color: cartItemsTable.color })
      .from(cartItemsTable)
      .where(eq(cartItemsTable.userId, userId));

    if (cartItems.length === 0) {
      res.status(400).json({ error: "Cart is empty" });
      return;
    }

    const productIds = cartItems.map(i => i.productId);
    const products = productIds.length > 0
      ? await db.select().from(productsTable).where(inArray(productsTable.id, productIds))
      : [];
    const productMap = Object.fromEntries(products.map(p => [p.id, p]));

    const orderItems = cartItems.map(item => {
      const product = productMap[item.productId];
      return {
        productId: item.productId,
        productName: product?.name || "Unknown",
        productImage: (product?.images as string[])?.[0] || "",
        quantity: item.quantity,
        price: parseFloat(product?.price || "0"),
        size: item.size,
        color: item.color,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // COD: ₹200 per unique item (not per quantity)
    const codCharge = paymentMethod === "cod" ? orderItems.length * COD_CHARGE_PER_ITEM : 0;
    const total = subtotal + codCharge;

    const [order] = await db.insert(ordersTable).values({
      userId,
      items: orderItems,
      subtotal: subtotal.toFixed(2),
      codCharge: codCharge.toFixed(2),
      total: total.toFixed(2),
      paymentMethod,
      paymentStatus: razorpayPaymentId ? "paid" : (paymentMethod === "advance" ? "pending" : "pending"),
      razorpayOrderId: razorpayOrderId || null,
      razorpayPaymentId: razorpayPaymentId || null,
      status: "confirmed",
      shippingAddress,
    }).returning();

    await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    res.status(201).json(serializeOrder(order, user?.name));
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }
  try {
    const id = parseInt(req.params.id);
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id)).limit(1);
    if (!order) { res.status(404).json({ error: "Order not found" }); return; }
    if (order.userId !== userId) {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
      if (!user || user.role !== "admin") { res.status(403).json({ error: "Forbidden" }); return; }
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, order.userId)).limit(1);
    res.json(serializeOrder(order, user?.name));
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
