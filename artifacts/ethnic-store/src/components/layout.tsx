import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Search, User as UserIcon, Menu, X, LogOut, LayoutDashboard, Package } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useCartStore } from "@/hooks/use-cart-store";
import { cn } from "@/lib/utils";

const MARQUEE_ITEMS = [
  "📦 Free Shipping in India",
  "🌍 International Courier Available (Ship Extra)",
  "💬 WhatsApp: +91 9974460041",
  "✨ New Festive Collection Live",
  "📦 Free Shipping in India",
  "🌍 International Courier Available (Ship Extra)",
  "💬 WhatsApp: +91 9974460041",
  "✨ New Festive Collection Live",
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart } = useCartStore();

  const navLinks = [
    { name: "Sarees", href: "/products?category=1" },
    { name: "Kurtas", href: "/products?category=2" },
    { name: "Lehengas", href: "/products?category=3" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground">
      {/* Marquee Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-xs py-2 overflow-hidden relative">
        <div className="flex whitespace-nowrap" style={{ animation: "marquee 28s linear infinite" }}>
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="inline-block px-8 font-medium tracking-wide">{item}</span>
          ))}
        </div>
        <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -ml-2 text-muted-foreground hover:text-primary transition-colors">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center flex-1 md:flex-none md:justify-start">
              <Link href="/" className="font-display text-2xl font-bold tracking-wider text-primary hover:opacity-80 transition-opacity">
                VastraVerge
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map(link => (
                <Link key={link.name} href={link.href} className="text-sm font-medium text-foreground hover:text-accent transition-colors duration-200 uppercase tracking-widest">
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Link href="/products" className="p-2 text-muted-foreground hover:text-primary transition-colors">
                <Search className="h-5 w-5" />
              </Link>
              
              <div className="relative group">
                <Link href={isAuthenticated ? "/my-orders" : "/login"} className="p-2 text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <UserIcon className="h-5 w-5" />
                </Link>
                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-card border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-border mb-2">
                          <p className="text-sm font-medium truncate">{user?.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                        {isAdmin && (
                          <Link href="/admin" className="flex items-center gap-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors">
                            <LayoutDashboard className="h-4 w-4" /> Admin Panel
                          </Link>
                        )}
                        <Link href="/my-orders" className="flex items-center gap-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors">
                          <Package className="h-4 w-4" /> My Orders
                        </Link>
                        <button onClick={logout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-left mt-1">
                          <LogOut className="h-4 w-4" /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="block px-4 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors">Login</Link>
                        <Link href="/register" className="block px-4 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors">Register</Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Link href={isAuthenticated ? "/cart" : "/login?redirect=/cart"} className="p-2 text-muted-foreground hover:text-primary transition-colors relative">
                <ShoppingBag className="h-5 w-5" />
                {isAuthenticated && cart && cart.itemCount > 0 && (
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-accent rounded-full">
                    {cart.itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        <div className={cn("md:hidden border-t border-border overflow-hidden transition-all duration-300 ease-in-out", isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0")}>
          <div className="px-4 pt-2 pb-4 space-y-1 bg-background">
            {/* User info if logged in */}
            {isAuthenticated && (
              <div className="px-3 py-3 mb-2 bg-primary/5 rounded-lg border border-border">
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            )}
            {navLinks.map(link => (
              <Link key={link.name} href={link.href} className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 uppercase tracking-wider" onClick={() => setIsMobileMenuOpen(false)}>
                {link.name}
              </Link>
            ))}
            <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-primary/5" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-primary/5" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            
            <div className="border-t border-border pt-2 mt-2 space-y-1">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5" onClick={() => setIsMobileMenuOpen(false)}>
                      <LayoutDashboard className="h-4 w-4" /> Admin Panel
                    </Link>
                  )}
                  <Link href="/my-orders" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5" onClick={() => setIsMobileMenuOpen(false)}>
                    <Package className="h-4 w-4" /> My Orders
                  </Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 text-left">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  <Link href="/register" className="block px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground pt-16 pb-8 border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold text-primary">VastraVerge</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Celebrating the rich heritage of Indian craftsmanship with our curated collection of elegant ethnic wear.
              </p>
              <div className="flex gap-3 pt-2">
                <a href="https://www.instagram.com/vastraverge/" target="_blank" rel="noopener noreferrer" title="Instagram" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300">
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a href="https://youtube.com/@vastraverge" target="_blank" rel="noopener noreferrer" title="YouTube" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-red-600 hover:text-white transition-all duration-300">
                  <YouTubeIcon className="w-5 h-5" />
                </a>
                <a href="https://chat.whatsapp.com/CopFkuHJAN16QJVID2z18L" target="_blank" rel="noopener noreferrer" title="Join WhatsApp Group" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-green-500 hover:text-white transition-all duration-300">
                  <WhatsAppIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/products" className="hover:text-primary transition-colors">Shop All</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><a href="https://chat.whatsapp.com/CopFkuHJAN16QJVID2z18L" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
                  <WhatsAppIcon className="w-3.5 h-3.5" /> Join WhatsApp Group
                </a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 uppercase tracking-wider text-sm">Categories</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {navLinks.map(link => (
                  <li key={link.name}><Link href={link.href} className="hover:text-primary transition-colors">{link.name}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 uppercase tracking-wider text-sm">Contact Us</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5">📍</span>
                  <span>Surat, Gujarat, India</span>
                </li>
                <li className="flex items-start gap-3">
                  <span>📞</span>
                  <span>
                    <a href="tel:+919974460041" className="hover:text-primary transition-colors block">+91 9974460041</a>
                    <a href="tel:+917802820906" className="hover:text-primary transition-colors block">+91 7802820906</a>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span>✉️</span>
                  <a href="mailto:vastraverge@gmail.com" className="hover:text-primary transition-colors">vastraverge@gmail.com</a>
                </li>
                <li className="flex items-center gap-3">
                  <WhatsAppIcon className="w-4 h-4 text-green-500 shrink-0" />
                  <a href="https://wa.me/919974460041" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">WhatsApp Us</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/60 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} VastraVerge. All rights reserved.</p>
              <p className="text-xs text-muted-foreground">
                Made by{" "}
                <a href="mailto:ishikaaa.jariwala@gmail.com" className="text-primary font-medium hover:underline transition-colors">Ishika Jariwala</a>
              </p>
            </div>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/vastraverge/" target="_blank" rel="noopener noreferrer" title="Instagram" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/@vastraverge" target="_blank" rel="noopener noreferrer" title="YouTube" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-red-600 hover:text-white transition-all duration-300">
                <YouTubeIcon className="w-5 h-5" />
              </a>
              <a href="https://chat.whatsapp.com/CopFkuHJAN16QJVID2z18L" target="_blank" rel="noopener noreferrer" title="WhatsApp Group" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-green-500 hover:text-white transition-all duration-300">
                <WhatsAppIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
