import { Layout } from "@/components/layout";
import { useRoute, Link } from "wouter";
import { useGetOrder } from "@workspace/api-client-react";
import { CheckCircle2, Package, MapPin, Calendar } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";

export default function OrderConfirmation() {
  const [, params] = useRoute("/orders/:id");
  const id = Number(params?.id);
  const { data: order, isLoading } = useGetOrder(id, { query: { enabled: !!id } });

  if (isLoading) return <Layout><div className="p-20 text-center">Loading order details...</div></Layout>;
  if (!order) return <Layout><div className="p-20 text-center">Order not found.</div></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for shopping with VastraVerge. Your order #{order.id} has been placed successfully.
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-muted/30 p-6 sm:px-8 border-b border-border flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2"><Calendar className="w-4 h-4"/> Order Date</p>
              <p className="font-semibold">{format(new Date(order.createdAt), "MMM dd, yyyy h:mm a")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <span className="inline-flex bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {order.status}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <h3 className="font-semibold text-lg mb-6 border-b border-border pb-2">Items Ordered</h3>
            <div className="space-y-6 mb-10">
              {order.items.map(item => (
                <div key={item.productId} className="flex gap-4">
                  <div className="w-20 h-24 bg-muted rounded-xl border border-border overflow-hidden shrink-0">
                    {item.productImage && <img src={item.productImage} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground mb-1">{item.productName}</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''} {item.color ? `| Color: ${item.color}` : ''}
                    </p>
                    <p className="font-semibold text-primary">{formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-muted/20 p-6 rounded-2xl border border-border">
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-3"><MapPin className="w-4 h-4"/> Shipping To</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                  <p className="pt-2">Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-3"><Package className="w-4 h-4"/> Payment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.paymentMethod === 'cod' && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>COD Fee</span>
                      <span>{formatPrice(order.codCharge)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-border mt-2">
                    <span>Total Paid</span>
                    <span className="text-primary">{formatPrice(order.total)}</span>
                  </div>
                  <div className="pt-2 text-xs text-muted-foreground capitalize">
                    Method: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Advance'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/products" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </Layout>
  );
}
