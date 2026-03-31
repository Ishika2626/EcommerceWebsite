import { pgTable, serial, integer, timestamp, varchar, decimal, jsonb, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  items: jsonb("items").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  codCharge: decimal("cod_charge", { precision: 10, scale: 2 }).notNull().default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 50 }).notNull().default("pending"),
  razorpayOrderId: varchar("razorpay_order_id", { length: 200 }),
  razorpayPaymentId: varchar("razorpay_payment_id", { length: 200 }),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  shippingAddress: jsonb("shipping_address").notNull(),
  trackingId: varchar("tracking_id", { length: 200 }),
  trackingUrl: varchar("tracking_url", { length: 500 }),
  trackingNote: text("tracking_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
