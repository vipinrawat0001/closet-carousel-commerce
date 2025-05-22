
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

// Define the shopping mode type
export type ShoppingMode = 'buy' | 'rent';

// Define the cart item types
export interface CartItemBase {
  id: string;
  productId: string;
  name: string;
  size: string;
  price: number;
  image: string;
}

export interface BuyCartItem extends CartItemBase {
  quantity: number;
}

export interface RentCartItem extends CartItemBase {
  dailyRate: number;
  deposit: number;
  durationDays: number;
  startDate: string;
  endDate: string;
}

// Type guard functions
export const isBuyCartItem = (item: CartItemBase): item is BuyCartItem => {
  return 'quantity' in item;
};

export const isRentCartItem = (item: CartItemBase): item is RentCartItem => {
  return 'dailyRate' in item && 'deposit' in item;
};

// Define the context type
interface StoreContextType {
  mode: ShoppingMode;
  setMode: (mode: ShoppingMode) => void;
  buyCart: BuyCartItem[];
  rentCart: RentCartItem[];
  addToBuyCart: (item: BuyCartItem) => void;
  addToRentCart: (item: RentCartItem) => void;
  removeFromBuyCart: (id: string) => void;
  removeFromRentCart: (id: string) => void;
  updateBuyCartItemQuantity: (id: string, quantity: number) => void;
  updateRentCartItemDuration: (id: string, durationDays: number, startDate: string, endDate: string) => void;
  clearBuyCart: () => void;
  clearRentCart: () => void;
  user: User | null;
  session: Session | null;
  profile: any | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

// Create the context
const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Create a provider component
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ShoppingMode>('buy');
  const [buyCart, setBuyCart] = useState<BuyCartItem[]>([]);
  const [rentCart, setRentCart] = useState<RentCartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load carts from localStorage on initial render
  useEffect(() => {
    const savedBuyCart = localStorage.getItem('buyCart');
    const savedRentCart = localStorage.getItem('rentCart');
    const savedMode = localStorage.getItem('shoppingMode');
    
    if (savedBuyCart) setBuyCart(JSON.parse(savedBuyCart));
    if (savedRentCart) setRentCart(JSON.parse(savedRentCart));
    if (savedMode && (savedMode === 'buy' || savedMode === 'rent')) setMode(savedMode as ShoppingMode);
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Save carts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('buyCart', JSON.stringify(buyCart));
  }, [buyCart]);

  useEffect(() => {
    localStorage.setItem('rentCart', JSON.stringify(rentCart));
  }, [rentCart]);

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shoppingMode', mode);
  }, [mode]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Cart management functions for buy items
  const addToBuyCart = (item: BuyCartItem) => {
    setBuyCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => 
        cartItem.productId === item.productId && cartItem.size === item.size
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += item.quantity;
        return updatedCart;
      } else {
        // Add new item
        return [...prevCart, item];
      }
    });
    
    toast({
      title: "Item added to cart",
      description: `${item.name} (${item.size}) has been added to your cart.`,
    });
  };

  const removeFromBuyCart = (id: string) => {
    setBuyCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateBuyCartItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromBuyCart(id);
      return;
    }
    
    setBuyCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearBuyCart = () => {
    setBuyCart([]);
  };

  // Cart management functions for rent items
  const addToRentCart = (item: RentCartItem) => {
    setRentCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => 
        cartItem.productId === item.productId && cartItem.size === item.size
      );
      
      if (existingItemIndex >= 0) {
        // Update item if it already exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...item,
          id: prevCart[existingItemIndex].id,
        };
        return updatedCart;
      } else {
        // Add new item
        return [...prevCart, item];
      }
    });
    
    toast({
      title: "Item added to rentals",
      description: `${item.name} (${item.size}) has been added to your rentals.`,
    });
  };

  const removeFromRentCart = (id: string) => {
    setRentCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateRentCartItemDuration = (id: string, durationDays: number, startDate: string, endDate: string) => {
    if (durationDays <= 0) {
      removeFromRentCart(id);
      return;
    }
    
    setRentCart(prevCart => 
      prevCart.map(item => 
        item.id === id 
          ? { ...item, durationDays, startDate, endDate } 
          : item
      )
    );
  };

  const clearRentCart = () => {
    setRentCart([]);
  };

  // Auth functions
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Registration successful",
        description: "Please check your email for a confirmation link.",
      });
      
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have successfully signed out.",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Check if user is an admin
  const isAdmin = profile?.role === 'admin';

  const value = {
    mode,
    setMode,
    buyCart,
    rentCart,
    addToBuyCart,
    addToRentCart,
    removeFromBuyCart,
    removeFromRentCart,
    updateBuyCartItemQuantity,
    updateRentCartItemDuration,
    clearBuyCart,
    clearRentCart,
    user,
    session,
    profile,
    isAdmin,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

// Custom hook to use the StoreContext
export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
