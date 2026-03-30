import { Layout } from "@/components/layout";
import { useCartStore } from "@/hooks/use-cart-store";
import { formatPrice } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeItem } = useCartStore();
  const { isAuthenticated } = useAuth();
  const [_, setLocation] = useLocation();

  if (isLoading) return <Layout><div className="p-20 text-center">Loading cart...</div></Layout>;

  const isEmpty = !cart || cart.items.length === 0;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setLocation("/login?redirect=/checkout");
    } else {
      setLocation("/checkout");
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Shopping Cart</h1>

        {isEmpty ? (
          <div className="text-center py-20 bg-card border border-border rounded-3xl shadow-sm">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border bg-muted/30">
                  <h3 className="font-semibold text-lg">Cart Items ({cart.itemCount})</h3>
                </div>
                <ul className="divide-y divide-border">
                  {cart.items.map((item) => {
                    const productImg = item.product.images?.[0] || "https://images.unsplash.com/photo-1583391733958-d25e07fac044?w=200&q=80";
                    return (
                      <li key={`${item.productId}-${item.size}-${item.color}`} className="p-6 flex flex-col sm:flex-row gap-6">
                        <Link href={`/products/${item.productId}`} className="shrink-0 w-24 h-32 rounded-xl overflow-hidden bg-muted border border-border block">
                          <img src={productImg} alt={item.product.name} className="w-full h-full object-cover" />
                        </Link>
                        
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <Link href={`/products/${item.productId}`} className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2 pr-4">
                              {item.product.name}
                            </Link>
                            <span className="font-bold text-lg shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                          </div>
                          
                          <div className="text-sm text-muted-foreground space-y-1 mb-4">
                            {item.size && <p>Size: <span className="font-medium text-foreground">{item.size}</span></p>}
                            {item.color && <p>Color: <span className="font-medium text-foreground capitalize">{item.color}</span></p>}
                            <p className="text-primary">{formatPrice(item.product.price)} each</p>
                          </div>
                          
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center w-28 bg-background border border-border rounded-lg p-1">
                              <button 
                                onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted transition-colors"
                              >-</button>
                              <span className="flex-1 text-center font-medium">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted transition-colors"
                              >+</button>
                            </div>
                            
                            <button 
                              onClick={() => removeItem(item.productId)}
                              className="text-muted-foreground hover:text-destructive p-2 transition-colors flex items-center gap-1 text-sm font-medium"
                            >
                              <Trash2 className="w-4 h-4" /> Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm sticky top-28">
                <h3 className="font-semibold text-xl mb-6">Order Summary</h3>
                
                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground font-medium">{formatPrice(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-foreground">Total</span>
                      <span className="font-bold text-2xl text-primary">{formatPrice(cart.total)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-right mt-1">Inclusive of all taxes</p>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </button>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" /> Secure Checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
