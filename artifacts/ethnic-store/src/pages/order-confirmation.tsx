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

        {/* Share your review CTA */}
        <div className="mt-10 bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/15 rounded-3xl p-8 text-center">
          <p className="text-2xl mb-2">📸</p>
          <h3 className="font-display text-xl font-bold text-foreground mb-2">Loved your purchase? Share it!</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Share your photos &amp; reviews on WhatsApp or Instagram and tag us — we'd love to feature you!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/919974460041"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              Share on WhatsApp
            </a>
            <a
              href="https://www.instagram.com/vastraverge/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-full font-semibold text-sm transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              Share on Instagram
            </a>
          </div>
        </div>

        <div className="text-center mt-8 space-y-4">
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
