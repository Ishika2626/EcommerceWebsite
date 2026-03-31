import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart-store";
import NotFound from "@/pages/not-found";
import { ReactNode, useEffect } from "react";

// Pages
import Home from "./pages/home";
import Products from "./pages/products";
import ProductDetail from "./pages/product-detail";
import CartPage from "./pages/cart";
import CheckoutPage from "./pages/checkout";
import OrderConfirmation from "./pages/order-confirmation";
import MyOrders from "./pages/my-orders";
import Login from "./pages/login";
import Register from "./pages/register";
import AboutUs from "./pages/about";
import ContactUs from "./pages/contact";

// Admin Pages
import AdminDashboard from "./pages/admin/dashboard";
import AdminProducts from "./pages/admin/products";
import AdminProductForm from "./pages/admin/product-form";
import AdminOrders from "./pages/admin/orders";
import AdminCategories from "./pages/admin/categories";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();
  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect to={`/login?redirect=${encodeURIComponent(location)}`} />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect to="/login" />;
  if (!isAdmin) return <Redirect to="/" />;
  return <>{children}</>;
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/about" component={AboutUs} />
      <Route path="/contact" component={ContactUs} />

      {/* Auth Routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      {/* User Protected Routes */}
      <Route path="/cart">
        <ProtectedRoute><CartPage /></ProtectedRoute>
      </Route>
      <Route path="/checkout">
        <ProtectedRoute><CheckoutPage /></ProtectedRoute>
      </Route>
      <Route path="/orders/:id">
        <ProtectedRoute><OrderConfirmation /></ProtectedRoute>
      </Route>
      <Route path="/my-orders">
        <ProtectedRoute><MyOrders /></ProtectedRoute>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin">
        <AdminRoute><AdminDashboard /></AdminRoute>
      </Route>
      <Route path="/admin/products">
        <AdminRoute><AdminProducts /></AdminRoute>
      </Route>
      <Route path="/admin/products/new">
        <AdminRoute><AdminProductForm /></AdminRoute>
      </Route>
      <Route path="/admin/products/:id/edit">
        <AdminRoute><AdminProductForm /></AdminRoute>
      </Route>
      <Route path="/admin/orders">
        <AdminRoute><AdminOrders /></AdminRoute>
      </Route>
      <Route path="/admin/categories">
        <AdminRoute><AdminCategories /></AdminRoute>
      </Route>

      <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Router />
              <Toaster />
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
