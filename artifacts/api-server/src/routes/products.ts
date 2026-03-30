import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable } from "@workspace/db/schema";
import { eq, like, and, desc, asc, count, sql } from "drizzle-orm";

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

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const offset = (page - 1) * limit;
    const category = req.query.category ? parseInt(req.query.category as string) : undefined;
    const search = req.query.search as string | undefined;
    const sort = req.query.sort as string | undefined;

    const conditions: any[] = [eq(productsTable.isActive, true)];
    if (category) conditions.push(eq(productsTable.categoryId, category));
    if (search) conditions.push(like(productsTable.name, `%${search}%`));

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    let orderBy: any = desc(productsTable.createdAt);
    if (sort === "price_asc") orderBy = asc(sql`${productsTable.price}::numeric`);
    else if (sort === "price_desc") orderBy = desc(sql`${productsTable.price}::numeric`);
    else if (sort === "newest") orderBy = desc(productsTable.createdAt);

    const products = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        price: productsTable.price,
        originalPrice: productsTable.originalPrice,
        categoryId: productsTable.categoryId,
        categoryName: categoriesTable.name,
        images: productsTable.images,
        stock: productsTable.stock,
        sizes: productsTable.sizes,
        colors: productsTable.colors,
        isFeatured: productsTable.isFeatured,
        isActive: productsTable.isActive,
        createdAt: productsTable.createdAt,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db
      .select({ total: count() })
      .from(productsTable)
      .where(whereClause);

    res.json({
      products: products.map((p) => ({ ...p, price: parseFloat(p.price), originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : null })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [product] = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        price: productsTable.price,
        originalPrice: productsTable.originalPrice,
        categoryId: productsTable.categoryId,
        categoryName: categoriesTable.name,
        images: productsTable.images,
        stock: productsTable.stock,
        sizes: productsTable.sizes,
        colors: productsTable.colors,
        isFeatured: productsTable.isFeatured,
        isActive: productsTable.isActive,
        createdAt: productsTable.createdAt,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(productsTable.id, id));

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ ...product, price: parseFloat(product.price), originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  if (!(await requireAdmin(req, res))) return;
  try {
    const { name, description, price, originalPrice, categoryId, images, stock, sizes, colors, isFeatured, isActive } = req.body;
    if (!name || price == null || !categoryId || stock == null) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    const [product] = await db
      .insert(productsTable)
      .values({ name, description, price: price.toString(), originalPrice: originalPrice?.toString(), categoryId, images: images || [], stock, sizes: sizes || [], colors: colors || [], isFeatured: isFeatured ?? false, isActive: isActive ?? true })
      .returning();
    const [category] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, product.categoryId)).limit(1);
    res.status(201).json({ ...product, price: parseFloat(product.price), originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null, categoryName: category?.name });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  if (!(await requireAdmin(req, res))) return;
  try {
    const id = parseInt(req.params.id);
    const { name, description, price, originalPrice, categoryId, images, stock, sizes, colors, isFeatured, isActive } = req.body;
    const [product] = await db
      .update(productsTable)
      .set({ name, description, price: price?.toString(), originalPrice: originalPrice?.toString(), categoryId, images, stock, sizes, colors, isFeatured, isActive })
      .where(eq(productsTable.id, id))
      .returning();
    const [category] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, product.categoryId)).limit(1);
    res.json({ ...product, price: parseFloat(product.price), originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null, categoryName: category?.name });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  if (!(await requireAdmin(req, res))) return;
  try {
    const id = parseInt(req.params.id);
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.json({ message: "Product deleted" });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
