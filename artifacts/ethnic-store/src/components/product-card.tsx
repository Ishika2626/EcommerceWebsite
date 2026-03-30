import { Link } from "wouter";
import { Product } from "@workspace/api-client-react";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";

export function ProductCard({ product, index }: { product: Product, index?: number }) {
  const mainImage = product.images?.[0] || "https://images.unsplash.com/photo-1583391733958-d25e07fac044?w=500&q=80";
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index || 0) * 0.1 }}
      className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
    >
      <Link href={`/products/${product.id}`} className="relative aspect-[3/4] overflow-hidden bg-muted">
        {/* fallback product image indian fashion */}
        <img 
          src={mainImage} 
          alt={product.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {discount}% OFF
          </div>
        )}
        {!product.isActive && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-card text-foreground px-4 py-2 font-bold uppercase tracking-widest text-sm rounded-lg shadow-lg">Out of Stock</span>
          </div>
        )}
      </Link>
      
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.categoryName || 'Apparel'}</p>
        <Link href={`/products/${product.id}`} className="font-medium text-lg leading-tight text-foreground hover:text-primary transition-colors line-clamp-1 mb-2">
          {product.name}
        </Link>
        
        <div className="mt-auto flex items-end justify-between">
          <div>
            <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="ml-2 text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
