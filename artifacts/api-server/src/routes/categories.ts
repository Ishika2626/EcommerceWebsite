import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { categoriesTable, productsTable } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (_req, res) => {
  try {
    const cats = await db.select().from(categoriesTable).orderBy(categoriesTable.name);
    const counts = await db
      .select({ categoryId: productsTable.categoryId, count: sql<number>`count(*)::int` })
      .from(productsTable)
      .where(eq(productsTable.isActive, true))
      .groupBy(productsTable.categoryId);
    const countMap = Object.fromEntries(counts.map((c) => [c.categoryId, c.count]));
    res.json(cats.map((c) => ({ ...c, productCount: countMap[c.id] ?? 0 })));
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const { db: dbLib } = await import("@workspace/db");
  const { usersTable: ut } = await import("@workspace/db/schema");
  const { eq: eqFn } = await import("drizzle-orm");
  const [user] = await dbLib.select().from(ut).where(eqFn(ut.id, userId)).limit(1);
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  try {
    const { name, description, image } = req.body;
    if (!name) {
      res.status(400).json({ error: "Name is required" });
      return;
    }
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const [cat] = await db.insert(categoriesTable).values({ name, slug, description, image }).returning();
    res.status(201).json({ ...cat, productCount: 0 });
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const { db: dbLib } = await import("@workspace/db");
  const { usersTable: ut } = await import("@workspace/db/schema");
  const { eq: eqFn } = await import("drizzle-orm");
  const [user] = await dbLib.select().from(ut).where(eqFn(ut.id, userId)).limit(1);
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  try {
    const id = parseInt(req.params.id);
    const { name, description, image } = req.body;
    const slug = name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const [cat] = await db.update(categoriesTable).set({ name, slug, description, image }).where(eq(categoriesTable.id, id)).returning();
    res.json({ ...cat, productCount: 0 });
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const { db: dbLib } = await import("@workspace/db");
  const { usersTable: ut } = await import("@workspace/db/schema");
  const { eq: eqFn } = await import("drizzle-orm");
  const [user] = await dbLib.select().from(ut).where(eqFn(ut.id, userId)).limit(1);
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  try {
    const id = parseInt(req.params.id);
    await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
    res.json({ message: "Category deleted" });
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
