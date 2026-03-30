import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Search, User as UserIcon, Menu, X, LogOut, LayoutDashboard, Package } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useCartStore } from "@/hooks/use-cart-store";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart } = useCartStore();

  const navLinks = [
    { name: "Sarees", href: "/products?category=1" },
    { name: "Kurtas", href: "/products?category=2" },
    { name: "Lehengas", href: "/products?category=3" },
    { name: "Ethnic Men", href: "/products?category=4" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground">
      {/* Top Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-xs py-2 text-center font-medium tracking-wide">
        Free Shipping on all orders above ₹5,000 | New Festive Collection Live
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 text-muted-foreground hover:text-primary transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center flex-1 md:flex-none md:justify-start">
              <Link href="/" className="font-display text-2xl font-bold tracking-wider text-primary hover:opacity-80 transition-opacity">
                EthnicVibe
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-sm font-medium text-foreground hover:text-accent transition-colors duration-200 uppercase tracking-widest"
                >
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
                {/* Dropdown Menu */}
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

              <Link href="/cart" className="p-2 text-muted-foreground hover:text-primary transition-colors relative">
                <ShoppingBag className="h-5 w-5" />
                {cart && cart.itemCount > 0 && (
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-accent rounded-full">
                    {cart.itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        <div className={cn("md:hidden border-t border-border overflow-hidden transition-all duration-300 ease-in-out", isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
          <div className="px-4 pt-2 pb-4 space-y-1 bg-background">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 uppercase tracking-wider"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground pt-16 pb-8 border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold text-primary">EthnicVibe</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Celebrating the rich heritage of Indian craftsmanship with our curated collection of elegant ethnic wear.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/products" className="hover:text-primary transition-colors">Shop All</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 uppercase tracking-wider text-sm">Categories</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {navLinks.map(link => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-primary transition-colors">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 uppercase tracking-wider text-sm">Contact Us</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5">📍</span>
                  <span>123 Heritage Lane, Textiles Hub<br/>Mumbai, India 400001</span>
                </li>
                <li className="flex items-center gap-3">
                  <span>📞</span>
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-3">
                  <span>✉️</span>
                  <span>hello@ethnicvibe.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/60 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} EthnicVibe. All rights reserved.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-white transition-colors">In</div>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-white transition-colors">Fb</div>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-white transition-colors">Tw</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
