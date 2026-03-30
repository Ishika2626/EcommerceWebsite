import { Layout } from "@/components/layout";
import { useCartStore } from "@/hooks/use-cart-store";
import { formatPrice } from "@/lib/utils";
import { useCreateOrder } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const { cart, isLoading: cartLoading, clearCart } = useCartStore();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState<"advance" | "cod">("advance");
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: ""
  });

  const createOrder = useCreateOrder({
    mutation: {
      onSuccess: (order) => {
        clearCart();
        toast({ title: "Order placed successfully!" });
        setLocation(`/orders/${order.id}`);
      },
      onError: (err: any) => {
        toast({ variant: "destructive", title: "Failed to place order", description: err.message });
      }
    }
  });

  if (cartLoading) return <Layout><div className="p-20 text-center">Loading...</div></Layout>;
  if (!cart || cart.items.length === 0) {
    setLocation("/cart");
    return null;
  }

  const codCharge = paymentMethod === "cod" ? 200 : 0;
  const finalTotal = cart.total + codCharge;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrder.mutate({
      data: {
        paymentMethod,
        shippingAddress: address
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Layout>
      <div className="bg-muted/30 border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold text-foreground">Checkout</h1>
          <div className="flex items-center gap-2 text-primary font-medium bg-primary/10 px-4 py-2 rounded-full text-sm">
            <ShieldCheck className="w-5 h-5" /> 100% Secure
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-7 space-y-8">
            {/* Shipping Address */}
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span>
                Shipping Address
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Full Name *</label>
                  <input required name="fullName" value={address.fullName} onChange={handleInputChange} className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Phone Number *</label>
                  <input required name="phone" value={address.phone} onChange={handleInputChange} className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Address Line 1 *</label>
                  <input required name="addressLine1" value={address.addressLine1} onChange={handleInputChange} className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Address Line 2 (Optional)</label>
                  <input name="addressLine2" value={address.addressLine2} onChange={handleInputChange} className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">City *</label>
                  <input required name="city" value={address.city} onChange={handleInputChange} className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">State *</label>
                  <input required name="state" value={address.state} onChange={handleInputChange} className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">PIN Code *</label>
                  <input required name="pincode" value={address.pincode} onChange={handleInputChange} className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">2</span>
                Payment Method
              </h2>
              
              <div className="space-y-4">
                <label className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-colors ${paymentMethod === 'advance' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                  <input type="radio" name="payment" value="advance" checked={paymentMethod === 'advance'} onChange={() => setPaymentMethod("advance")} className="mt-1 w-5 h-5 text-primary focus:ring-primary" />
                  <div>
                    <span className="block font-bold text-foreground mb-1">Advance Payment (Online)</span>
                    <span className="text-sm text-muted-foreground">Pay securely via Credit Card, Debit Card, UPI, or NetBanking. No extra charges.</span>
                  </div>
                </label>
                
                <label className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod("cod")} className="mt-1 w-5 h-5 text-primary focus:ring-primary" />
                  <div>
                    <span className="block font-bold text-foreground mb-1">Cash on Delivery (COD)</span>
                    <span className="text-sm text-muted-foreground">Pay when your order arrives. <span className="text-destructive font-medium">Additional ₹200 handling fee applies.</span></span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm sticky top-28">
              <h3 className="font-semibold text-xl mb-6">Order Details</h3>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-auto pr-2">
                {cart.items.map(item => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="w-16 h-20 rounded-lg bg-muted overflow-hidden shrink-0 border border-border">
                      <img src={item.product.images?.[0]} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium line-clamp-2 mb-1">{item.product.name}</p>
                      <p className="text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="font-semibold text-primary">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm border-t border-border pt-6 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">{formatPrice(cart.subtotal)}</span>
                </div>
                {paymentMethod === "cod" && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>COD Handling Fee</span>
                    <span className="text-destructive font-medium">+ {formatPrice(200)}</span>
                  </div>
                )}
                <div className="border-t border-border pt-4 mt-2">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-lg text-foreground">Total to Pay</span>
                    <span className="font-bold text-3xl text-primary">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={createOrder.isPending}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {createOrder.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Place Order"}
              </button>
            </div>
          </div>
          
        </form>
      </div>
    </Layout>
  );
}
