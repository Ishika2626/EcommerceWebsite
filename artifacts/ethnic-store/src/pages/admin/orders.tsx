import { AdminLayout } from "@/components/admin-layout";
import { useAdminListOrders, useUpdateOrderStatus, UpdateOrderStatusRequestStatus } from "@workspace/api-client-react";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrders() {
  const { data, isLoading } = useAdminListOrders();
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

  return (
    <AdminLayout>
      <h1 className="text-3xl font-display font-bold text-foreground mb-8">Manage Orders</h1>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase tracking-wider text-xs">
              <tr>
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center">Loading...</td></tr>
              ) : data?.orders.map(order => (
                <tr key={order.id} className="hover:bg-muted/20">
                  <td className="p-4 font-semibold">#{order.id}</td>
                  <td className="p-4 text-muted-foreground">{format(new Date(order.createdAt), "MMM dd, yyyy")}</td>
                  <td className="p-4">
                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                    <p className="text-xs text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  </td>
                  <td className="p-4 font-bold text-primary">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <span className="uppercase text-xs font-bold tracking-wider">{order.paymentMethod}</span>
                  </td>
                  <td className="p-4 text-right">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updateMutation.isPending}
                      className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none uppercase tracking-wider text-xs"
                    >
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
