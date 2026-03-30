import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ordersTable, cartItemsTable, productsTable, usersTable } from "@workspace/db/schema";
import { eq, desc, count, and, sql } from "drizzle-orm";

const router: IRouter = Router();

const COD_CHARGE = 200;

router.get("/", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  try {
    const orders = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.userId, userId))
      .orderBy(desc(ordersTable.createdAt));
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    res.json(orders.map((o) => ({
      ...o,
      userName: user?.name,
      subtotal: parseFloat(o.subtotal),
      codCharge: parseFloat(o.codCharge),
      total: parseFloat(o.total),
    })));
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  try {
    const { paymentMethod, shippingAddress } = req.body;
    if (!paymentMethod || !shippingAddress) {
      res.status(400).json({ error: "paymentMethod and shippingAddress are required" });
      return;
    }

    const cartItems = await db
      .select({ id: cartItemsTable.id, productId: cartItemsTable.productId, quantity: cartItemsTable.quantity, size: cartItemsTable.size, color: cartItemsTable.color })
      .from(cartItemsTable)
      .where(eq(cartItemsTable.userId, userId));

    if (cartItems.length === 0) {
      res.status(400).json({ error: "Cart is empty" });
      return;
    }

    const productIds = cartItems.map((i) => i.productId);
    const products = await db.select().from(productsTable).where(sql`${productsTable.id} = ANY(${productIds})`);
    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

    const orderItems = cartItems.map((item) => {
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
    const codCharge = paymentMethod === "cod" ? COD_CHARGE : 0;
    const total = subtotal + codCharge;

    const [order] = await db.insert(ordersTable).values({
      userId,
      items: orderItems,
      subtotal: subtotal.toString(),
      codCharge: codCharge.toString(),
      total: total.toString(),
      paymentMethod,
      paymentStatus: paymentMethod === "advance" ? "paid" : "pending",
      status: "confirmed",
      shippingAddress,
    }).returning();

    await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    res.status(201).json({
      ...order,
      userName: user?.name,
      subtotal: parseFloat(order.subtotal),
      codCharge: parseFloat(order.codCharge),
      total: parseFloat(order.total),
    });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  try {
    const id = parseInt(req.params.id);
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id)).limit(1);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    if (order.userId !== userId) {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
      if (!user || user.role !== "admin") {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, order.userId)).limit(1);
    res.json({
      ...order,
      userName: user?.name,
      subtotal: parseFloat(order.subtotal),
      codCharge: parseFloat(order.codCharge),
      total: parseFloat(order.total),
    });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
