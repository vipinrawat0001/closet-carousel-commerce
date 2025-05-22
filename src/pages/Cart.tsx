
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X, Minus, Plus, ArrowRight, ShoppingBag, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Cart = () => {
  const { buyCart, removeFromBuyCart, updateBuyCartItemQuantity, clearBuyCart, user } = useStore();
  const navigate = useNavigate();
  
  // Calculate subtotal
  const subtotal = buyCart.reduce((total, item) => total + item.price * item.quantity, 0);
  
  // Calculate shipping based on subtotal
  const shippingCost = subtotal > 50 ? 0 : 5.99;
  
  // Calculate total
  const total = subtotal + shippingCost;
  
  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Please sign in to checkout",
        description: "You need to be logged in to complete your purchase.",
      });
      navigate('/auth');
      return;
    }
    
    navigate('/checkout');
  };
  
  // Empty cart state
  if (buyCart.length === 0) {
    return (
      <div className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="lg:flex-1">
          <div className="rounded-lg border overflow-hidden">
            <div className="p-4 bg-muted/40">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {buyCart.length} {buyCart.length === 1 ? 'Item' : 'Items'}
                </span>
                <Button variant="ghost" size="sm" onClick={clearBuyCart} className="h-8 text-sm">
                  <RefreshCw className="mr-1 h-3 w-3" /> Clear All
                </Button>
              </div>
            </div>
            
            {buyCart.map(item => (
              <div key={item.id} className="p-4 border-t flex gap-4">
                {/* Product image */}
                <div className="w-20 h-20 rounded border overflow-hidden flex-shrink-0">
                  <img 
                    src={item.image || 'https://placehold.co/200x200?text=No+Image'} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Product details */}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <Link to={`/product/${item.productId}`} className="font-medium hover:text-primary">
                      {item.name}
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 text-muted-foreground" 
                      onClick={() => removeFromBuyCart(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">Size: {item.size}</div>
                  <div className="mt-2 flex justify-between items-center">
                    {/* Quantity control */}
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7" 
                        onClick={() => updateBuyCartItemQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2 w-8 text-center">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7" 
                        onClick={() => updateBuyCartItemQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {/* Item price */}
                    <div>
                      <div className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                      {item.quantity > 1 && (
                        <div className="text-xs text-muted-foreground text-right">
                          ${item.price.toFixed(2)} each
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <Button variant="outline" asChild className="text-sm">
              <Link to="/shop">
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" /> Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:w-80">
          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                {shippingCost === 0 ? 
                  <span className="text-green-600">Free</span> : 
                  <span>${shippingCost.toFixed(2)}</span>}
              </div>
              
              {shippingCost > 0 && (
                <div className="text-xs text-muted-foreground">
                  Free shipping on orders over $50
                </div>
              )}
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <Button className="w-full mt-6" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
            
            <div className="mt-4 text-xs text-muted-foreground text-center">
              Taxes calculated at checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
