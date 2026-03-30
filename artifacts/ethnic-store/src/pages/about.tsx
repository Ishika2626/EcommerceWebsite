import { Layout } from "@/components/layout";
import { Link } from "wouter";

export default function AboutUs() {
  return (
    <Layout>
      {/* Hero */}
      <div className="bg-primary/5 border-b border-border py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary font-medium uppercase tracking-widest text-sm mb-3">Our Story</p>
          <h1 className="font-display text-5xl font-bold text-foreground mb-4">About VastraVerge</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Where tradition meets elegance — bringing you the finest in Indian ethnic wear.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              VastraVerge was born out of a passion for preserving and celebrating the rich textile heritage of India. We believe every thread tells a story — of skilled artisans, centuries-old techniques, and a culture that dresses its moments in beauty.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We curate authentic ethnic wear — from stunning Banarasi sarees to royal sherwanis — bringing India's finest craftsmanship to your doorstep. Whether it's a wedding, festival, or everyday elegance, we have something for every occasion.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Based in <strong className="text-foreground">Surat, Gujarat</strong> — the textile capital of India — we're deeply rooted in the world of fabrics and craftsmanship.
            </p>
          </div>
          <div className="bg-primary/10 rounded-3xl p-8 text-center space-y-6">
            <div>
              <p className="font-display text-4xl font-bold text-primary">100+</p>
              <p className="text-muted-foreground text-sm mt-1">Ethnic Products</p>
            </div>
            <div className="border-t border-border/40 pt-6">
              <p className="font-display text-4xl font-bold text-primary">Free</p>
              <p className="text-muted-foreground text-sm mt-1">Shipping Across India</p>
            </div>
            <div className="border-t border-border/40 pt-6">
              <p className="font-display text-4xl font-bold text-primary">🌍</p>
              <p className="text-muted-foreground text-sm mt-1">International Delivery Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="bg-primary/5 border-y border-border py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">Meet the Founders</h2>
            <p className="text-muted-foreground">The passionate duo behind VastraVerge</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Ishika */}
            <div className="bg-card border border-border rounded-3xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🌸
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-1">Ishika Jariwala</h3>
              <p className="text-primary font-medium text-sm uppercase tracking-wider mb-4">Co-Founder & Designer</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                With a deep love for Indian textiles and an eye for design, Ishika brings VastraVerge's curations to life. She ensures every piece reflects authenticity and elegance.
              </p>
              <a
                href="mailto:ishikaaa.jariwala@gmail.com"
                className="inline-block mt-4 text-sm text-primary hover:underline"
              >
                ishikaaa.jariwala@gmail.com
              </a>
            </div>

            {/* Prachi */}
            <div className="bg-card border border-border rounded-3xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🌺
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-1">Prachi</h3>
              <p className="text-primary font-medium text-sm uppercase tracking-wider mb-4">Co-Founder & Operations</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Prachi drives the operational heart of VastraVerge — from sourcing the finest fabrics to ensuring every order reaches you beautifully and on time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="font-display text-3xl font-bold text-foreground mb-4">Ready to explore?</h2>
        <p className="text-muted-foreground mb-8">Browse our curated collection of authentic Indian ethnic wear.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
            Shop Now
          </Link>
          <Link href="/contact" className="border border-border text-foreground px-8 py-3 rounded-xl font-semibold hover:bg-muted transition-colors">
            Contact Us
          </Link>
        </div>
      </section>
    </Layout>
  );
}
