import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { ArrowRight, Star, ShieldCheck, Truck, RefreshCcw, Globe, MessageCircle, Package } from "lucide-react";
import { motion } from "framer-motion";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  );
}

export default function Home() {
  const { data: trendingData, isLoading: trendingLoading } = useListProducts({ params: { limit: 4, sort: "popular" } });
  const { data: newData, isLoading: newLoading } = useListProducts({ params: { limit: 4, sort: "newest" } });

  const categories = [
    { id: 1, name: "Sarees", desc: "Elegance in six yards", img: "https://images.unsplash.com/photo-1610189013444-24b455b55dd6?w=600&q=80" },
    { id: 2, name: "Kurtas", desc: "Comfort meets style", img: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=600&q=80" },
    { id: 3, name: "Lehengas", desc: "For your special days", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/45 z-10" />
        <img
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
          alt="Elegant Indian Fashion"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-accent font-medium uppercase tracking-[0.3em] text-sm mb-4"
          >
            New Festive Collection
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg leading-tight"
          >
            Elegance Woven in <span className="text-accent">Tradition</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light"
          >
            Discover authentic Indian ethnic wear — crafted with love, delivered across India for free.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1"
            >
              Shop Collection <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://chat.whatsapp.com/CopFkuHJAN16QJVID2z18L"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-1"
            >
              <WhatsAppIcon className="w-5 h-5" /> Join Our Group
            </a>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-secondary py-10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Free Shipping", desc: "Across India on all orders" },
              { icon: Globe, title: "International", desc: "Worldwide delivery available" },
              { icon: ShieldCheck, title: "Secure Payment", desc: "COD & Online via Razorpay" },
              { icon: RefreshCcw, title: "Easy Returns", desc: "7-day return policy" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 bg-card p-5 rounded-2xl shadow-sm">
                <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">{title}</h3>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 relative">
        <div className="pattern-overlay absolute inset-0 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <p className="text-primary font-medium uppercase tracking-widest text-sm mb-2">Browse by</p>
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
                transition={{ delay: i * 0.15 }}
                className="group relative h-[420px] rounded-3xl overflow-hidden shadow-lg cursor-pointer"
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

      {/* Trending Now */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-primary font-medium uppercase tracking-widest text-sm mb-2">Hot Picks</p>
              <h2 className="font-display text-4xl font-bold text-foreground mb-3">Trending Now 🔥</h2>
              <div className="w-24 h-1 bg-accent rounded-full"></div>
            </div>
            <Link href="/products" className="hidden sm:flex text-primary font-medium hover:text-primary/80 items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {trendingLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="bg-card rounded-2xl aspect-[3/4] animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingData?.products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
          <div className="text-center mt-8 sm:hidden">
            <Link href="/products" className="inline-flex items-center gap-1 text-primary font-medium">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-primary font-medium uppercase tracking-widest text-sm mb-2">Just In</p>
              <h2 className="font-display text-4xl font-bold text-foreground mb-3">New Arrivals ✨</h2>
              <div className="w-24 h-1 bg-accent rounded-full"></div>
            </div>
            <Link href="/products?sort=newest" className="hidden sm:flex text-primary font-medium hover:text-primary/80 items-center gap-1">
              See All New <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {newLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="bg-card rounded-2xl aspect-[3/4] animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newData?.products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why VastraVerge */}
      <section className="py-20 bg-primary/5 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">Why Choose VastraVerge?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">From the textile capital of India — Surat, Gujarat — we bring you authentic ethnic wear with unmatched quality and service.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: "🧵", title: "Authentic Craftsmanship", desc: "Each piece is handpicked from skilled artisans across India — Banarasi, Kanjivaram, Chanderi, and more." },
              { emoji: "📦", title: "Free Shipping in India", desc: "We offer free shipping across India on all orders. International delivery also available at extra charges." },
              { emoji: "🤝", title: "Trusted by Thousands", desc: "Our customers love us! Join our WhatsApp group to see the latest collections, reviews and exclusive offers." },
            ].map(item => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-3xl p-8 shadow-sm text-center hover:shadow-md transition-shadow"
              >
                <div className="text-5xl mb-4">{item.emoji}</div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA Banner */}
      <section className="py-14 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <WhatsAppIcon className="w-10 h-10" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Join Our WhatsApp Community</h2>
          <p className="text-white/90 mb-8 text-lg">Get early access to new arrivals, exclusive deals, and easy order support — all in one group!</p>
          <a
            href="https://chat.whatsapp.com/CopFkuHJAN16QJVID2z18L"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-8 py-4 rounded-full text-lg hover:bg-green-50 transition-colors shadow-lg hover:-translate-y-1 duration-300"
          >
            <WhatsAppIcon className="w-5 h-5" />
            Join the Group Now
          </a>
          <p className="text-white/70 text-sm mt-4">📞 Also reach us at: +91 9974460041</p>
        </div>
      </section>
    </Layout>
  );
}
