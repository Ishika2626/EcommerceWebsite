import { Layout } from "@/components/layout";
import { useRoute, Link } from "wouter";
import { useGetOrder } from "@workspace/api-client-react";
import { CheckCircle2, Package, MapPin, Calendar, Truck, ExternalLink } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";

export default function OrderConfirmation() {
  const [, params] = useRoute("/orders/:id");
  const id = Number(params?.id);
  const { data: order, isLoading } = useGetOrder(id, { query: { enabled: !!id } });

  if (isLoading) return <Layout><div className="p-20 text-center">Loading order details...</div></Layout>;
  if (!order) return <Layout><div className="p-20 text-center">Order not found.</div></Layout>;

  const isCOD = order.paymentMethod === "cod";

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for shopping with VastraVerge. Your order <strong>#{order.id}</strong> has been placed successfully.
          </p>
          {isCOD && (
            <div className="mt-4 inline-block bg-orange-50 border border-orange-200 rounded-2xl px-6 py-3">
              <p className="text-sm font-semibold text-orange-800">COD Order — Pay <strong>{formatPrice(order.subtotal)}</strong> in cash at delivery.</p>
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-muted/30 p-6 sm:px-8 border-b border-border flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2"><Calendar className="w-4 h-4" /> Order Date</p>
              <p className="font-semibold">{format(new Date(order.createdAt), "MMM dd, yyyy h:mm a")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                order.status === "delivered" ? "bg-green-100 text-green-800" :
                order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                order.status === "cancelled" ? "bg-red-100 text-red-800" :
                "bg-primary/10 text-primary"
              }`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Tracking Info */}
          {(order as any).trackingId && (
            <div className="p-6 sm:px-8 bg-blue-50 border-b border-blue-200">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-700"><Truck className="w-5 h-5" /></div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-1">Shipment Tracking</h4>
                  <p className="text-sm text-blue-800">
                    Tracking ID: <strong>{(order as any).trackingId}</strong>
                  </p>
                  {(order as any).trackingNote && (
                    <p className="text-sm text-blue-700 mt-1">{(order as any).trackingNote}</p>
                  )}
                  {(order as any).trackingUrl && (
                    <a
                      href={(order as any).trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-blue-700 hover:text-blue-900 underline"
                    >
                      Track your shipment <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

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
                      Qty: {item.quantity}{item.size ? ` | Size: ${item.size}` : ""}{item.color ? ` | Color: ${item.color}` : ""}
                    </p>
                    <p className="font-semibold text-primary">{formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-muted/20 p-6 rounded-2xl border border-border">
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-3"><MapPin className="w-4 h-4" /> Shipping To</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                  <p className="pt-2">Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-3"><Package className="w-4 h-4" /> Payment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Product Total</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  {isCOD ? (
                    <>
                      <div className="flex justify-between text-muted-foreground">
                        <span>COD Booking (paid online)</span>
                        <span className="text-orange-600 font-medium">{formatPrice(order.codCharge)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base pt-2 border-t border-border mt-2">
                        <span>Pay at Delivery</span>
                        <span className="text-blue-700">{formatPrice(order.subtotal)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between font-bold text-base pt-2 border-t border-border mt-2">
                      <span>Total Paid</span>
                      <span className="text-primary">{formatPrice(order.subtotal)}</span>
                    </div>
                  )}
                  <div className="pt-2 text-xs text-muted-foreground capitalize">
                    Method: {isCOD ? "Cash on Delivery" : "Online Advance"}
                    {order.paymentStatus === "paid" && <span className="ml-2 text-green-600 font-medium">✓ Paid</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 space-y-4">
          <Link href="/my-orders" className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-8 py-3 rounded-full font-medium hover:bg-primary/20 transition-colors mr-4">
            View All Orders
          </Link>
          <Link href="/products" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </Layout>
  );
}
