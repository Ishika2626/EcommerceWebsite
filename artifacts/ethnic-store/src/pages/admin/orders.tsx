import { AdminLayout } from "@/components/admin-layout";
import { useAdminListOrders, useUpdateOrderStatus, UpdateOrderStatusRequestStatus } from "@workspace/api-client-react";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Truck, X, Save, MapPin, Copy, Check, ChevronDown, ChevronUp, Package } from "lucide-react";
import { Pagination } from "@/components/pagination";

interface TrackingFormState {
  trackingId: string;
  trackingUrl: string;
  trackingNote: string;
}

function AddressBlock({ address }: { address: any }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  if (!address) return null;

  const lines = [
    address.fullName,
    address.phone,
    address.alternatePhone ? `Alt: ${address.alternatePhone}` : null,
    address.addressLine1,
    address.addressLine2,
    [address.city, address.state, address.pincode].filter(Boolean).join(", "),
    address.country,
  ].filter(Boolean);

  const fullText = lines.join("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = fullText;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="border-t border-border">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-2 px-4 md:px-6 py-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors text-left"
      >
        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="flex-1 truncate">
          {address.fullName} — {address.addressLine1}, {address.city}
        </span>
        {open ? <ChevronUp className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
      </button>

      {open && (
        <div className="px-4 md:px-6 pb-4 bg-muted/10">
          <div className="flex items-start justify-between gap-4 bg-card border border-border rounded-xl p-4">
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-foreground">{address.fullName}</p>
              {address.phone && (
                <p className="text-muted-foreground">{address.phone}</p>
              )}
              <p className="text-foreground">{address.addressLine1}</p>
              {address.addressLine2 && (
                <p className="text-foreground">{address.addressLine2}</p>
              )}
              <p className="text-foreground">
                {[address.city, address.state, address.pincode].filter(Boolean).join(", ")}
              </p>
              {address.country && (
                <p className="text-muted-foreground">{address.country}</p>
              )}
            </div>
            <button
              onClick={handleCopy}
              title="Copy full address"
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                copied
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary hover:bg-primary/5"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface OrderItem {
  productId: number;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

function ItemsBlock({ items, total }: { items: OrderItem[]; total: number }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!items || items.length === 0) return null;

  const summary = items.map(it => `${it.productName} x${it.quantity}${it.size ? ` (${it.size})` : ""}${it.color ? ` [${it.color}]` : ""}`).join(", ");

  const fullText = items
    .map(it =>
      [
        `Product: ${it.productName} (ID: ${it.productId})`,
        `Qty: ${it.quantity}`,
        it.size ? `Size: ${it.size}` : null,
        it.color ? `Color: ${it.color}` : null,
        `Price: ₹${it.price}`,
      ]
        .filter(Boolean)
        .join(" | ")
    )
    .join("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = fullText;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="border-t border-border">
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center gap-2 px-4 md:px-6 py-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors text-left"
      >
        <Package className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="flex-1 truncate">{summary}</span>
        {open ? <ChevronUp className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
      </button>

      {open && (
        <div className="px-4 md:px-6 pb-4 bg-muted/10">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
              <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Order Items</span>
              <button
                onClick={handleCopy}
                title="Copy order details"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                  copied
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary hover:bg-primary/5"
                }`}
              >
                {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy Details</>}
              </button>
            </div>
            <div className="divide-y divide-border">
              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3">
                  {item.productImage && (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-14 h-18 rounded-lg object-cover border border-border shrink-0"
                      style={{ height: "72px" }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">Product ID: #{item.productId}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.size && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
                          Size: {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-accent/10 text-accent-foreground text-xs font-medium">
                          Color: {item.color}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">Qty</p>
                    <p className="font-bold text-foreground">{item.quantity}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end px-4 py-2 border-t border-border bg-muted/20">
              <span className="text-sm font-bold text-primary">Total: ₹{total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrders() {
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useAdminListOrders({
    params: { page },
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [trackingOpen, setTrackingOpen] = useState<number | null>(null);
  const [trackingForms, setTrackingForms] = useState<Record<number, TrackingFormState>>({});
  const [savingTracking, setSavingTracking] = useState<number | null>(null);

  const totalPages = data?.totalPages ?? 1;

  const updateMutation = useUpdateOrderStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/api/admin/orders`] });
        toast({ title: "Order status updated" });
      },
    },
  });

  const handleStatusChange = (id: number, status: string) => {
    updateMutation.mutate({ id, data: { status: status as UpdateOrderStatusRequestStatus } });
  };

  const openTracking = (order: any) => {
    setTrackingForms((prev) => ({
      ...prev,
      [order.id]: {
        trackingId: order.trackingId || "",
        trackingUrl: order.trackingUrl || "",
        trackingNote: order.trackingNote || "",
      },
    }));
    setTrackingOpen(order.id);
  };

  const saveTracking = async (orderId: number) => {
    setSavingTracking(orderId);
    try {
      const form = trackingForms[orderId];
      const res = await fetch(`/api/admin/orders/${orderId}/tracking`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save tracking");
      toast({ title: "Tracking info saved", description: `Order #${orderId} tracking updated.` });
      setTrackingOpen(null);
      refetch();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Failed to save tracking", description: err.message });
    } finally {
      setSavingTracking(null);
    }
  };

  const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

  const statusColors: Record<string, string> = {
    pending: "text-yellow-700 bg-yellow-100",
    confirmed: "text-blue-700 bg-blue-100",
    processing: "text-purple-700 bg-purple-100",
    shipped: "text-indigo-700 bg-indigo-100",
    delivered: "text-green-700 bg-green-100",
    cancelled: "text-red-700 bg-red-100",
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Manage Orders</h1>
        {data?.total != null && (
          <p className="text-sm text-muted-foreground mt-1">{data.total} total orders</p>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {data?.orders.map((order) => (
              <div key={order.id} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="p-4 md:p-6 flex flex-wrap justify-between items-start gap-4">
                  <div className="flex flex-wrap gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Order</p>
                      <p className="font-bold text-primary">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Date</p>
                      <p className="font-medium text-sm">{format(new Date(order.createdAt), "MMM dd, yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Customer</p>
                      <p className="font-medium text-sm">
                        {(order as any).shippingAddress?.fullName || order.userName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(order as any).shippingAddress?.city}, {(order as any).shippingAddress?.state}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Amount</p>
                      <p className="font-bold text-primary">{formatPrice(order.total)}</p>
                      <p className="text-xs text-muted-foreground uppercase">{order.paymentMethod}</p>
                    </div>
                    {order.paymentMethod === "cod" && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">COD Charge</p>
                        <p className="font-medium text-orange-600 text-sm">{formatPrice(order.codCharge)} paid</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(order.subtotal)} at delivery</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openTracking(order)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      {(order as any).trackingId ? "Edit Tracking" : "Add Tracking"}
                    </button>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updateMutation.isPending}
                      className={`border rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none uppercase tracking-wider ${
                        statusColors[order.status] || "bg-background border-border"
                      }`}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Order Items (collapsible, copyable) */}
                <ItemsBlock items={(order as any).items ?? []} total={order.total} />

                {/* Shipping Address (collapsible, copyable) */}
                <AddressBlock address={(order as any).shippingAddress} />

                {/* Tracking Input (inline expand) */}
                {trackingOpen === order.id && (
                  <div className="border-t border-border p-4 md:p-6 bg-blue-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                        <Truck className="w-4 h-4" /> Add / Update Tracking
                      </h4>
                      <button
                        onClick={() => setTrackingOpen(null)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-blue-800 mb-1">
                          Tracking ID / AWB Number
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 1234567890"
                          value={trackingForms[order.id]?.trackingId || ""}
                          onChange={(e) =>
                            setTrackingForms((prev) => ({
                              ...prev,
                              [order.id]: { ...prev[order.id], trackingId: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-white text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-blue-800 mb-1">
                          Tracking URL (Optional)
                        </label>
                        <input
                          type="url"
                          placeholder="https://track.courier.com/..."
                          value={trackingForms[order.id]?.trackingUrl || ""}
                          onChange={(e) =>
                            setTrackingForms((prev) => ({
                              ...prev,
                              [order.id]: { ...prev[order.id], trackingUrl: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-white text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-blue-800 mb-1">
                          Note to Customer (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Shipped via Delhivery, expected by tomorrow"
                          value={trackingForms[order.id]?.trackingNote || ""}
                          onChange={(e) =>
                            setTrackingForms((prev) => ({
                              ...prev,
                              [order.id]: { ...prev[order.id], trackingNote: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-white text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => saveTracking(order.id)}
                        disabled={savingTracking === order.id}
                        className="flex items-center gap-2 px-5 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-60"
                      >
                        <Save className="w-4 h-4" />
                        {savingTracking === order.id ? "Saving..." : "Save Tracking"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Tracking Display */}
                {!(trackingOpen === order.id) && (order as any).trackingId && (
                  <div className="border-t border-border px-4 md:px-6 py-3 bg-muted/20 text-xs text-muted-foreground flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-blue-500" />
                    <span>
                      Tracking: <strong className="text-foreground">{(order as any).trackingId}</strong>
                    </span>
                    {(order as any).trackingNote && <span>— {(order as any).trackingNote}</span>}
                  </div>
                )}
              </div>
            ))}

            {data?.orders.length === 0 && (
              <div className="text-center py-20 text-muted-foreground bg-card border border-border rounded-2xl">
                No orders yet.
              </div>
            )}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={data?.total}
          />
        </>
      )}
    </AdminLayout>
  );
}
