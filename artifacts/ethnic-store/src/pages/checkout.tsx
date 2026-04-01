import { Layout } from "@/components/layout";
import { useCartStore } from "@/hooks/use-cart-store";
import { formatPrice } from "@/lib/utils";
import { useCreateOrder } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { ShieldCheck, Loader2, Truck, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const COD_CHARGE_PER_ITEM = 200;

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { cart, isLoading: cartLoading, clearCart } = useCartStore();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<"advance" | "cod">("advance");
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayConfigured, setRazorpayConfigured] = useState<boolean | null>(null);
  const [address, setAddress] = useState({
    fullName: "", phone: "", alternatePhone: "", addressLine1: "", addressLine2: "", city: "", state: "", pincode: ""
  });

  useEffect(() => {
    fetch("/api/razorpay/config")
      .then(r => r.json())
      .then(data => setRazorpayConfigured(data.configured))
      .catch(() => setRazorpayConfigured(false));
  }, []);

  useEffect(() => {
    if (cart && cart.items.some(item => (item.product as any).isCodAvailable === false)) {
      setPaymentMethod("advance");
    }
  }, [cart]);

  const createOrder = useCreateOrder({
    mutation: {
      onSuccess: (order) => {
        clearCart();
        toast({ title: "Order placed successfully!" });
        setLocation(`/orders/${order.id}`);
      },
      onError: (err: any) => {
        toast({ variant: "destructive", title: "Failed to place order", description: err.message || "Please try again." });
        setIsProcessing(false);
      }
    }
  });

  if (cartLoading) return <Layout><div className="p-20 text-center">Loading...</div></Layout>;
  if (!cart || cart.items.length === 0) {
    setLocation("/cart");
    return null;
  }

  const itemCount = cart.items.length;
  const codBlockedItems = cart.items.filter(item => (item.product as any).isCodAvailable === false);
  const isCodBlocked = codBlockedItems.length > 0;
  const codCharge = paymentMethod === "cod" ? itemCount * COD_CHARGE_PER_ITEM : 0;
  const amountPayableNow = paymentMethod === "cod" ? codCharge : cart.subtotal;
  const amountAtDelivery = paymentMethod === "cod" ? cart.subtotal : 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const placeOrderDirectly = (extraData?: { razorpayOrderId?: string; razorpayPaymentId?: string; razorpaySignature?: string }) => {
    createOrder.mutate({
      data: {
        paymentMethod,
        shippingAddress: address,
        ...extraData,
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (razorpayConfigured) {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast({ variant: "destructive", title: "Payment gateway failed to load", description: "Please check your internet connection." });
        setIsProcessing(false);
        return;
      }

      try {
        const res = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentMethod }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to initiate payment");

        const rzp = new window.Razorpay({
          key: data.keyId,
          amount: Math.round(data.amount * 100),
          currency: data.currency,
          order_id: data.razorpayOrderId,
          name: "VastraVerge",
          description: paymentMethod === "cod"
            ? `COD Booking Charge (₹${COD_CHARGE_PER_ITEM} × ${itemCount} items)`
            : "Full Payment - Ethnic Wear",
          prefill: { name: address.fullName, contact: address.phone },
          theme: { color: "#7B1C2E" },
          handler: (response: any) => {
            placeOrderDirectly({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              toast({ title: "Payment cancelled", description: "You can try again anytime." });
            }
          }
        });
        rzp.open();
      } catch (err: any) {
        toast({ variant: "destructive", title: "Payment error", description: err.message || "Please try again." });
        setIsProcessing(false);
      }
    } else {
      placeOrderDirectly();
    }
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
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Full Name *</label>
                  <input required name="fullName" value={address.fullName} onChange={handleInputChange} className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Phone Number *</label>
                  <input required name="phone" value={address.phone} onChange={handleInputChange} className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Alternate Phone (Optional)</label>
                  <input name="alternatePhone" value={address.alternatePhone} onChange={handleInputChange} className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Address Line 1 *</label>
                  <input required name="addressLine1" value={address.addressLine1} onChange={handleInputChange} className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Address Line 2 (Optional)</label>
                  <input name="addressLine2" value={address.addressLine2} onChange={handleInputChange} className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">City *</label>
                  <input required name="city" value={address.city} onChange={handleInputChange} className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">State *</label>
                  <input required name="state" value={address.state} onChange={handleInputChange} className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">PIN Code *</label>
                  <input required name="pincode" value={address.pincode} onChange={handleInputChange} className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
                Payment Method
              </h2>
              <div className="space-y-4">
                <label className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-colors ${paymentMethod === "advance" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                  <input type="radio" name="payment" value="advance" checked={paymentMethod === "advance"} onChange={() => setPaymentMethod("advance")} className="mt-1 w-5 h-5 text-primary focus:ring-primary" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-primary" />
                      <span className="font-bold text-foreground">Advance / Online Payment</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Pay the full amount now via UPI, Credit/Debit Card, or NetBanking. No extra charges.</p>
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-green-800">Pay Now: {formatPrice(cart.subtotal)}</p>
                      <p className="text-xs text-green-600 mt-0.5">Nothing to pay at delivery</p>
                    </div>
                  </div>
                </label>

                <label className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-colors ${isCodBlocked ? "opacity-60 cursor-not-allowed border-border bg-muted/30" : `cursor-pointer ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => !isCodBlocked && setPaymentMethod("cod")} disabled={isCodBlocked} className="mt-1 w-5 h-5 text-primary focus:ring-primary" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="w-4 h-4 text-primary" />
                      <span className="font-bold text-foreground">Cash on Delivery (COD)</span>
                      {isCodBlocked && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">Not available</span>}
                    </div>
                    {isCodBlocked ? (
                      <div className="mt-2 text-sm text-orange-700 bg-orange-50 border border-orange-200 rounded-lg p-3">
                        COD is not available for: <span className="font-semibold">{codBlockedItems.map(i => i.product.name).join(", ")}</span>. Please use online payment.
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground">Pay a small booking charge online to confirm your order. Balance paid at delivery.</p>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <p className="text-xs text-orange-700 font-medium">Pay Online Now</p>
                            <p className="text-sm font-bold text-orange-900 mt-0.5">{formatPrice(itemCount * COD_CHARGE_PER_ITEM)}</p>
                            <p className="text-xs text-orange-600">₹{COD_CHARGE_PER_ITEM} × {itemCount} item{itemCount > 1 ? "s" : ""}</p>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-xs text-blue-700 font-medium">Pay at Delivery</p>
                            <p className="text-sm font-bold text-blue-900 mt-0.5">{formatPrice(cart.subtotal)}</p>
                            <p className="text-xs text-blue-600">Product price in cash</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm sticky top-28">
              <h3 className="font-semibold text-xl mb-6">Order Summary</h3>

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
                  <span>Product Total</span>
                  <span className="text-foreground">{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>

                {paymentMethod === "cod" ? (
                  <>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-foreground">Pay Online Now</span>
                        <span className="font-bold text-xl text-orange-600">{formatPrice(codCharge)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">COD booking charge (₹{COD_CHARGE_PER_ITEM} × {itemCount} item{itemCount > 1 ? "s" : ""})</p>
                    </div>
                    <div className="flex justify-between items-center bg-blue-50 rounded-xl p-3">
                      <div>
                        <p className="text-sm font-medium text-blue-900">Pay at Delivery</p>
                        <p className="text-xs text-blue-600">Cash payment on arrival</p>
                      </div>
                      <span className="font-bold text-blue-900">{formatPrice(cart.subtotal)}</span>
                    </div>
                  </>
                ) : (
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-lg text-foreground">Total to Pay</span>
                      <span className="font-bold text-3xl text-primary">{formatPrice(cart.subtotal)}</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isProcessing || createOrder.isPending}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {(isProcessing || createOrder.isPending) ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : razorpayConfigured ? (
                  <>Pay {formatPrice(amountPayableNow)} via Razorpay</>
                ) : (
                  <>Place Order</>
                )}
              </button>

              {razorpayConfigured === false && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Direct order placement (payment gateway not configured)
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
