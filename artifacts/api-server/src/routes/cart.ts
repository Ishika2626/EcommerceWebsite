import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { cartItemsTable, productsTable, categoriesTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

async function getCartData(userId: number) {
  const items = await db
    .select({
      id: cartItemsTable.id,
      productId: cartItemsTable.productId,
      quantity: cartItemsTable.quantity,
      size: cartItemsTable.size,
      color: cartItemsTable.color,
      product: {
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
      },
    })
    .from(cartItemsTable)
    .leftJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(cartItemsTable.userId, userId));

  const enriched = items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    product: {
      ...item.product,
      price: parseFloat(item.product?.price ?? "0"),
      originalPrice: item.product?.originalPrice ? parseFloat(item.product.originalPrice) : null,
    },
  }));

  const subtotal = enriched.reduce((sum, item) => sum + (item.product?.price ?? 0) * item.quantity, 0);
  return {
    items: enriched,
    subtotal,
    total: subtotal,
    itemCount: enriched.reduce((sum, item) => sum + item.quantity, 0),
  };
}

router.get("/", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    res.json({ items: [], subtotal: 0, total: 0, itemCount: 0 });
    return;
  }
  try {
    res.json(await getCartData(userId));
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  try {
    await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));
    res.json({ message: "Cart cleared" });
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/items", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  try {
    const { productId, quantity, size, color } = req.body;
    if (!productId || !quantity) {
      res.status(400).json({ error: "productId and quantity are required" });
      return;
    }
    const existing = await db
      .select()
      .from(cartItemsTable)
      .where(and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.productId, productId)))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(cartItemsTable)
        .set({ quantity: existing[0].quantity + quantity, size: size || existing[0].size, color: color || existing[0].color })
        .where(eq(cartItemsTable.id, existing[0].id));
    } else {
      await db.insert(cartItemsTable).values({ userId, productId, quantity, size, color });
    }
    res.json(await getCartData(userId));
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/items/:productId", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  try {
    const productId = parseInt(req.params.productId);
    const { quantity } = req.body;
    if (quantity <= 0) {
      await db.delete(cartItemsTable).where(and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.productId, productId)));
    } else {
      await db.update(cartItemsTable).set({ quantity }).where(and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.productId, productId)));
    }
    res.json(await getCartData(userId));
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/items/:productId", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  try {
    const productId = parseInt(req.params.productId);
    await db.delete(cartItemsTable).where(and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.productId, productId)));
    res.json(await getCartData(userId));
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
