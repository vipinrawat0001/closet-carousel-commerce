
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "@/contexts/StoreContext";
import RootLayout from "@/components/layout/RootLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import Shop from "./pages/Shop";
import Rent from "./pages/Rent";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import RentalCart from "./pages/RentalCart";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderTracking from "./pages/admin/OrderTracking";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <StoreProvider>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/rent" element={<Rent />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/rental-cart" element={<RentalCart />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth" element={<Auth />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminAuth />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="buy-orders" element={<OrderTracking />} />
              <Route path="rent-orders" element={<OrderTracking />} />
              <Route path="customers" element={<div>Customers Management</div>} />
              <Route path="settings" element={<div>Admin Settings</div>} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </StoreProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
