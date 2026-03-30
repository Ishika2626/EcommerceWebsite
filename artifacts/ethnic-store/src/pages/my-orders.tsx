import { Layout } from "@/components/layout";
import { useListOrders } from "@workspace/api-client-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { formatPrice } from "@/lib/utils";
import { Package, ArrowRight } from "lucide-react";

export default function MyOrders() {
  const { data: orders, isLoading } = useListOrders();

  return (
    <Layout>
      <div className="bg-primary/5 py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-primary">My Orders</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-muted rounded-2xl"></div>)}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-border">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">You haven't placed any orders.</p>
            <Link href="/products" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium">Shop Now</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-muted/40 p-4 sm:p-6 border-b border-border flex flex-wrap justify-between items-center gap-4">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Order Placed</p>
                      <p className="font-medium">{format(new Date(order.createdAt), "MMM dd, yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total</p>
                      <p className="font-medium text-primary">{formatPrice(order.total)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {order.status}
                    </span>
                    <Link href={`/orders/${order.id}`} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                      View Details <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {order.items.map(item => (
                      <div key={item.productId} className="shrink-0 w-24 flex flex-col gap-2">
                        <div className="w-24 h-32 bg-muted rounded-xl overflow-hidden border border-border">
                          {item.productImage && <img src={item.productImage} className="w-full h-full object-cover" />}
                        </div>
                        <p className="text-xs text-center line-clamp-1" title={item.productName}>{item.productName}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
