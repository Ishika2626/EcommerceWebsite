import { Layout } from "@/components/layout";
import { useGetProduct } from "@workspace/api-client-react";
import { useRoute } from "wouter";
import { formatPrice, cn } from "@/lib/utils";
import { useState } from "react";
import { ShoppingBag, Heart, Share2, Shield, Truck, MessageCircle } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart-store";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const id = Number(params?.id);
  const { data: product, isLoading, isError } = useGetProduct(id, { query: { enabled: !!id } });
  
  const { addItem, isAdding } = useCartStore();
  const { toast } = useToast();

  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-muted rounded-3xl"></div>
            <div className="space-y-6">
              <div className="h-10 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded w-1/4"></div>
              <div className="h-32 bg-muted rounded w-full"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !product) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = async () => {
    if (product.sizes?.length && !selectedSize) {
      toast({ title: "Please select a size", variant: "destructive" });
      return;
    }
    if (product.colors?.length && !selectedColor) {
      toast({ title: "Please select a color", variant: "destructive" });
      return;
    }

    await addItem({
      productId: product.id,
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined
    });
  };

  const images = product.images?.length ? product.images : ["https://images.unsplash.com/photo-1583391733958-d25e07fac044?w=800&q=80"];
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {images.length > 1 && (
              <div className="flex md:flex-col gap-4 overflow-auto md:w-24 shrink-0 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImageIndex(idx)}
                    className={cn(
                      "w-20 h-24 md:w-full md:h-32 rounded-xl overflow-hidden border-2 transition-all shrink-0",
                      mainImageIndex === idx ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 bg-muted rounded-3xl overflow-hidden aspect-[3/4] relative border border-border shadow-sm">
              <img 
                src={images[mainImageIndex]} 
                alt={product.name} 
                className="w-full h-full object-cover object-top"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1.5 rounded-full font-bold shadow-md">
                  {discount}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-primary font-medium tracking-widest uppercase text-sm mb-2">{product.categoryName}</p>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
              {product.name}
            </h1>
            {(product as any).sku && (
              <p className="text-xs text-muted-foreground mb-4">SKU: <span className="font-mono">{(product as any).sku}</span></p>
            )}
            
            <div className="flex items-end gap-4 mb-6">
              <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-muted-foreground line-through mb-1">{formatPrice(product.originalPrice)}</span>
              )}
              <span className="text-sm text-green-600 font-medium mb-1.5">Inclusive of all taxes</span>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {product.description || "A beautiful piece crafted with traditional techniques. Perfect for your festive wardrobe."}
            </p>

            <div className="space-y-8 mb-10">
              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-foreground">Size</span>
                    <button className="text-sm text-primary underline">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "w-14 h-14 rounded-full border-2 flex items-center justify-center font-medium transition-all",
                          selectedSize === size 
                            ? "border-primary bg-primary text-primary-foreground" 
                            : "border-border text-foreground hover:border-primary/50"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <span className="font-semibold text-foreground block mb-3">Color: <span className="text-muted-foreground capitalize">{selectedColor || 'Select'}</span></span>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all relative",
                          selectedColor === color ? "border-primary scale-110" : "border-border hover:scale-105"
                        )}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <span className="font-semibold text-foreground block mb-3">Quantity</span>
                <div className="flex items-center w-32 bg-card border border-border rounded-full p-1">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-foreground transition-colors"
                  >-</button>
                  <span className="flex-1 text-center font-semibold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-foreground transition-colors"
                  >+</button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={isAdding || product.stock === 0}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all duration-300",
                  product.stock > 0 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5" 
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <ShoppingBag className="w-5 h-5" />
                {isAdding ? "Adding..." : product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
              <button className="p-4 border-2 border-border text-foreground rounded-xl hover:bg-muted transition-colors flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </button>
              <button className="p-4 border-2 border-border text-foreground rounded-xl hover:bg-muted transition-colors flex items-center justify-center">
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg text-primary"><Shield className="w-5 h-5" /></div>
                <div className="text-sm"><p className="font-semibold">Authentic</p><p className="text-muted-foreground">100% genuine products</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg text-primary"><Truck className="w-5 h-5" /></div>
                <div className="text-sm"><p className="font-semibold">Free Delivery</p><p className="text-muted-foreground">Free on all orders in India</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><MessageCircle className="w-5 h-5" /></div>
                <div className="text-sm"><p className="font-semibold">Exchange Policy</p><p className="text-muted-foreground">Exchange on damage/defect only with opening video</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Share2 className="w-5 h-5" /></div>
                <div className="text-sm">
                  <p className="font-semibold">Share Your Look</p>
                  <p className="text-muted-foreground">
                    Tag us on{" "}
                    <a href="https://www.instagram.com/vastraverge/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Instagram</a>
                    {" "}or{" "}
                    <a href="https://wa.me/919974460041" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">WhatsApp</a>
                  </p>
                </div>
              </div>
            </div>

            {/* International Order Note */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
              <span className="text-xl shrink-0">🌍</span>
              <div className="text-sm">
                <p className="font-semibold text-blue-900">International Order?</p>
                <p className="text-blue-700 mt-0.5">For international shipping, please connect with us on{" "}
                  <a href="https://wa.me/919974460041" target="_blank" rel="noopener noreferrer" className="font-medium underline">WhatsApp</a>
                  {" "}or{" "}
                  <a href="https://www.instagram.com/vastraverge/" target="_blank" rel="noopener noreferrer" className="font-medium underline">Instagram</a>
                  {" "}for a shipping quote.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
