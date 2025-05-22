
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X, ArrowRight, Clock, RefreshCw, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const RentalCart = () => {
  const { rentCart, removeFromRentCart, updateRentCartItemDuration, clearRentCart, user } = useStore();
  const navigate = useNavigate();
  
  // Calculate total rent amount
  const totalRentAmount = rentCart.reduce((total, item) => 
    total + (item.dailyRate * item.durationDays), 0);
  
  // Calculate total deposit
  const totalDeposit = rentCart.reduce((total, item) => total + item.deposit, 0);
  
  // Calculate shipping based on total rent amount
  const shippingCost = totalRentAmount > 50 ? 0 : 5.99;
  
  // Calculate total payment
  const totalPayment = totalRentAmount + totalDeposit + shippingCost;
  
  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Please sign in to checkout",
        description: "You need to be logged in to complete your rental.",
      });
      navigate('/auth');
      return;
    }
    
    navigate('/rental-checkout');
  };
  
  // Empty cart state
  if (rentCart.length === 0) {
    return (
      <div className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Your Rental Cart</h1>
        <div className="text-center py-12">
          <Clock className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">Your rental cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any rentals to your cart yet.
          </p>
          <Button asChild>
            <Link to="/rent">Browse Rental Items</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Your Rental Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="lg:flex-1">
          <div className="rounded-lg border overflow-hidden">
            <div className="p-4 bg-muted/40">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {rentCart.length} {rentCart.length === 1 ? 'Item' : 'Items'}
                </span>
                <Button variant="ghost" size="sm" onClick={clearRentCart} className="h-8 text-sm">
                  <RefreshCw className="mr-1 h-3 w-3" /> Clear All
                </Button>
              </div>
            </div>
            
            {rentCart.map(item => (
              <RentalItem 
                key={item.id} 
                item={item} 
                removeItem={removeFromRentCart}
                updateDuration={updateRentCartItemDuration}
              />
            ))}
          </div>
          
          <div className="mt-4">
            <Button variant="outline" asChild className="text-sm">
              <Link to="/rent">
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" /> Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:w-80">
          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-medium mb-4">Rental Summary</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rental Total</span>
                <span>${totalRentAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Deposit</span>
                <span>${totalDeposit.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                {shippingCost === 0 ? 
                  <span className="text-green-600">Free</span> : 
                  <span>${shippingCost.toFixed(2)}</span>}
              </div>
              
              {shippingCost > 0 && (
                <div className="text-xs text-muted-foreground">
                  Free shipping on rentals over $50
                </div>
              )}
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-medium">
                <span>Total Payment</span>
                <span>${totalPayment.toFixed(2)}</span>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Deposit is refundable after item return in good condition
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

interface RentalItemProps {
  item: any;
  removeItem: (id: string) => void;
  updateDuration: (id: string, duration: number, startDate: string, endDate: string) => void;
}

const RentalItem: React.FC<RentalItemProps> = ({ item, removeItem, updateDuration }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(item.startDate));
  const [selectedDuration, setSelectedDuration] = useState(item.durationDays);
  
  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    
    // Calculate new end date
    const newEndDate = new Date(date);
    newEndDate.setDate(newEndDate.getDate() + selectedDuration - 1);
    
    updateDuration(
      item.id, 
      selectedDuration, 
      date.toISOString(), 
      newEndDate.toISOString()
    );
    
    setIsCalendarOpen(false);
  };
  
  const handleDurationChange = (duration: number) => {
    if (!selectedDate) return;
    
    setSelectedDuration(duration);
    
    // Calculate new end date
    const newEndDate = new Date(selectedDate);
    newEndDate.setDate(newEndDate.getDate() + duration - 1);
    
    updateDuration(
      item.id, 
      duration, 
      selectedDate.toISOString(), 
      newEndDate.toISOString()
    );
  };

  return (
    <div className="p-4 border-t flex gap-4">
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
            onClick={() => removeItem(item.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">Size: {item.size}</div>
        
        {/* Rental period and price */}
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Period:</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                {selectedDuration} {selectedDuration === 1 ? 'day' : 'days'}
              </Button>
              
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(item.startDate), 'MMM d')} - {format(new Date(item.endDate), 'MMM d')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    initialFocus
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Duration:</span>
            <div className="flex gap-2">
              {[1, 3, 5, 7].map(days => (
                <Button
                  key={days}
                  variant={selectedDuration === days ? "default" : "outline"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => handleDurationChange(days)}
                >
                  {days}d
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap justify-between items-end gap-2 pt-1">
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">Daily:</span>
              <span>${item.dailyRate.toFixed(2)}</span>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="text-sm font-medium">
                ${(item.dailyRate * item.durationDays).toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                + ${item.deposit.toFixed(2)} deposit
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalCart;
