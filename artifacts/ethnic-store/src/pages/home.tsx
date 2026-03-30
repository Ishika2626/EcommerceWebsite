import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { ArrowRight, Star, ShieldCheck, Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data, isLoading } = useListProducts({ params: { limit: 4, sort: 'popular' } });

  const categories = [
    { id: 1, name: "Sarees", desc: "Elegance in six yards", img: "https://images.unsplash.com/photo-1610189013444-24b455b55dd6?w=600&q=80" },
    { id: 2, name: "Kurtas", desc: "Comfort meets style", img: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=600&q=80" },
    { id: 3, name: "Lehengas", desc: "For your special days", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
          alt="Elegant Indian Fashion" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg"
          >
            Elegance Woven in <span className="text-accent">Tradition</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light"
          >
            Discover our curated collection of authentic Indian ethnic wear, crafted with love and centuries of cultural heritage.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1"
            >
              Shop Collection <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-secondary py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 bg-card p-6 rounded-2xl shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Premium Quality</h3>
                <p className="text-sm text-muted-foreground">Authentic fabrics & craft</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-card p-6 rounded-2xl shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">Across India in 3-5 days</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-card p-6 rounded-2xl shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Secure Checkout</h3>
                <p className="text-sm text-muted-foreground">COD & Online Payments</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 relative">
        <div className="pattern-overlay absolute inset-0 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">Shop by Category</h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <motion.div 
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group relative h-[400px] rounded-3xl overflow-hidden shadow-lg cursor-pointer"
              >
                <Link href={`/products?category=${cat.id}`}>
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                    <h3 className="font-display text-3xl font-bold text-white mb-2">{cat.name}</h3>
                    <p className="text-white/80 mb-4 font-medium">{cat.desc}</p>
                    <span className="inline-flex items-center text-accent font-semibold group-hover:translate-x-2 transition-transform">
                      Explore <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-4xl font-bold text-foreground mb-4">Trending Now</h2>
              <div className="w-24 h-1 bg-accent rounded-full"></div>
            </div>
            <Link href="/products" className="text-primary font-medium hover:text-primary/80 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-card rounded-2xl aspect-[3/4] animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data?.products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
