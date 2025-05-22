
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "@/contexts/StoreContext";
import RootLayout from "@/components/layout/RootLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Shop from "./pages/Shop";
import Rent from "./pages/Rent";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import RentalCart from "./pages/RentalCart";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </StoreProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
