import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ordersTable, usersTable, productsTable } from "@workspace/db/schema";
import { eq, desc, count, sql } from "drizzle-orm";

const router: IRouter = Router();

async function requireAdmin(req: any, res: any): Promise<boolean> {
  const userId = req.session?.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  const { db: dbLib } = await import("@workspace/db");
  const { usersTable: ut } = await import("@workspace/db/schema");
  const { eq: eqFn } = await import("drizzle-orm");
  const [user] = await dbLib.select().from(ut).where(eqFn(ut.id, userId)).limit(1);
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return false;
  }
  return true;
}

router.get("/orders", async (req, res) => {
  if (!(await requireAdmin(req, res))) return;
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    const status = req.query.status as string | undefined;

    let query = db.select().from(ordersTable).$dynamic();
    if (status) query = query.where(eq(ordersTable.status, status));

    const orders = await query.orderBy(desc(ordersTable.createdAt)).limit(limit).offset(offset);

    const userIds = [...new Set(orders.map((o) => o.userId))];
    const users = userIds.length > 0
      ? await db.select().from(usersTable).where(sql`${usersTable.id} = ANY(${userIds})`)
      : [];
    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

    const [{ total }] = await db.select({ total: count() }).from(ordersTable);

    res.json({
      orders: orders.map((o) => ({
        ...o,
        userName: userMap[o.userId]?.name,
        subtotal: parseFloat(o.subtotal),
        codCharge: parseFloat(o.codCharge),
        total: parseFloat(o.total),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/orders/:id/status", async (req, res) => {
  if (!(await requireAdmin(req, res))) return;
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const [order] = await db.update(ordersTable).set({ status }).where(eq(ordersTable.id, id)).returning();
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

router.get("/stats", async (req, res) => {
  if (!(await requireAdmin(req, res))) return;
  try {
    const [{ totalOrders }] = await db.select({ totalOrders: count() }).from(ordersTable);
    const [{ totalProducts }] = await db.select({ totalProducts: count() }).from(productsTable);
    const [{ totalUsers }] = await db.select({ totalUsers: count() }).from(usersTable);

    const revenueResult = await db.select({ revenue: sql<number>`COALESCE(SUM(total::numeric), 0)` }).from(ordersTable);
    const totalRevenue = parseFloat(String(revenueResult[0]?.revenue ?? 0));

    const recentOrders = await db
      .select()
      .from(ordersTable)
      .orderBy(desc(ordersTable.createdAt))
      .limit(5);

    const userIds = [...new Set(recentOrders.map((o) => o.userId))];
    const users = userIds.length > 0
      ? await db.select().from(usersTable).where(sql`${usersTable.id} = ANY(${userIds})`)
      : [];
    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

    const topProductsRaw = await db
      .select({
        productId: sql<number>`(item->>'productId')::int`,
        productName: sql<string>`item->>'productName'`,
        totalSold: sql<number>`SUM((item->>'quantity')::int)`,
      })
      .from(sql`${ordersTable}, jsonb_array_elements(${ordersTable.items}) AS item`)
      .groupBy(sql`item->>'productId', item->>'productName'`)
      .orderBy(desc(sql`SUM((item->>'quantity')::int)`))
      .limit(5);

    res.json({
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
      recentOrders: recentOrders.map((o) => ({
        ...o,
        userName: userMap[o.userId]?.name,
        subtotal: parseFloat(o.subtotal),
        codCharge: parseFloat(o.codCharge),
        total: parseFloat(o.total),
      })),
      topProducts: topProductsRaw.map((p) => ({
        productId: p.productId,
        productName: p.productName,
        totalSold: parseInt(String(p.totalSold)),
      })),
    });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
