import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Package, ShoppingCart, Tags, LogOut, ArrowLeft, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Categories", href: "/admin/categories", icon: Tags },
  ];

  const isActive = (href: string) =>
    location === href || (location.startsWith(href) && href !== "/admin");

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-border">
          <Link href="/" className="font-display text-xl font-bold text-primary flex items-center gap-2">
            <span className="bg-primary text-white p-1.5 rounded-lg text-sm">VV</span>
            Admin
          </Link>
        </div>
        
        <div className="p-4 flex-1">
          <div className="space-y-1 mb-8">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Store</p>
            <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>
          </div>

          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Menu</p>
            {links.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive(link.href)
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <button onClick={logout} className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-xl text-destructive hover:bg-destructive/10 transition-all">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-card border-b border-border flex items-center justify-between px-4">
          <Link href="/" className="font-display font-bold text-primary text-lg">VastraVerge Admin</Link>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-muted-foreground hover:text-primary">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-card border-b border-border shadow-lg z-40">
            <div className="p-4 space-y-1">
              <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                <ArrowLeft className="w-4 h-4" /> Back to Store
              </Link>
              {links.map(link => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl",
                      isActive(link.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}
              <button onClick={logout} className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-xl text-destructive hover:bg-destructive/10">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        )}
        
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
