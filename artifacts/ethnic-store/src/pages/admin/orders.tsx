import { AdminLayout } from "@/components/admin-layout";
import { useAdminListOrders, useUpdateOrderStatus, UpdateOrderStatusRequestStatus } from "@workspace/api-client-react";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Truck, X, Save } from "lucide-react";

interface TrackingFormState {
  trackingId: string;
  trackingUrl: string;
  trackingNote: string;
}

export default function AdminOrders() {
  const { data, isLoading, refetch } = useAdminListOrders();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [trackingOpen, setTrackingOpen] = useState<number | null>(null);
  const [trackingForms, setTrackingForms] = useState<Record<number, TrackingFormState>>({});
  const [savingTracking, setSavingTracking] = useState<number | null>(null);

  const updateMutation = useUpdateOrderStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/api/admin/orders`] });
        toast({ title: "Order status updated" });
      }
    }
  });

  const handleStatusChange = (id: number, status: string) => {
    updateMutation.mutate({ id, data: { status: status as UpdateOrderStatusRequestStatus } });
  };

  const openTracking = (order: any) => {
    setTrackingForms(prev => ({
      ...prev,
      [order.id]: {
        trackingId: order.trackingId || "",
        trackingUrl: order.trackingUrl || "",
        trackingNote: order.trackingNote || "",
      }
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
      <h1 className="text-3xl font-display font-bold text-foreground mb-8">Manage Orders</h1>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted animate-pulse rounded-2xl" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {data?.orders.map(order => (
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
                    <p className="font-medium text-sm">{(order as any).shippingAddress?.fullName || order.userName}</p>
                    <p className="text-xs text-muted-foreground">{(order as any).shippingAddress?.city}, {(order as any).shippingAddress?.state}</p>
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
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                    disabled={updateMutation.isPending}
                    className={`border rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none uppercase tracking-wider ${statusColors[order.status] || "bg-background border-border"}`}
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Tracking Input (inline expand) */}
              {trackingOpen === order.id && (
                <div className="border-t border-border p-4 md:p-6 bg-blue-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-blue-900 flex items-center gap-2"><Truck className="w-4 h-4" /> Add / Update Tracking</h4>
                    <button onClick={() => setTrackingOpen(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-blue-800 mb-1">Tracking ID / AWB Number</label>
                      <input
                        type="text"
                        placeholder="e.g. 1234567890"
                        value={trackingForms[order.id]?.trackingId || ""}
                        onChange={e => setTrackingForms(prev => ({ ...prev, [order.id]: { ...prev[order.id], trackingId: e.target.value } }))}
                        className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-white text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-blue-800 mb-1">Tracking URL (Optional)</label>
                      <input
                        type="url"
                        placeholder="https://track.courier.com/..."
                        value={trackingForms[order.id]?.trackingUrl || ""}
                        onChange={e => setTrackingForms(prev => ({ ...prev, [order.id]: { ...prev[order.id], trackingUrl: e.target.value } }))}
                        className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-white text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-blue-800 mb-1">Note to Customer (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Shipped via Delhivery, expected by tomorrow"
                        value={trackingForms[order.id]?.trackingNote || ""}
                        onChange={e => setTrackingForms(prev => ({ ...prev, [order.id]: { ...prev[order.id], trackingNote: e.target.value } }))}
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
                  <span>Tracking: <strong className="text-foreground">{(order as any).trackingId}</strong></span>
                  {(order as any).trackingNote && <span>— {(order as any).trackingNote}</span>}
                </div>
              )}
            </div>
          ))}

          {data?.orders.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">No orders yet.</div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
