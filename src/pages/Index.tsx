
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const { setMode } = useStore();
  const navigate = useNavigate();
  
  const handleBuyClick = () => {
    setMode('buy');
    navigate('/shop');
  };
  
  const handleRentClick = () => {
    setMode('rent');
    navigate('/rent');
  };

  return (
    <div className="container py-12">
      {/* Hero Banner */}
      <section className="relative rounded-lg overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d" 
          alt="Fashion Banner" 
          className="w-full h-[60vh] object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Style That Fits Your Life
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Buy or rent premium clothing for any occasion. Express yourself without limits.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={handleBuyClick}>
                <ShoppingBag className="mr-2 h-5 w-5" /> Shop Now
              </Button>
              <Button size="lg" variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30" onClick={handleRentClick}>
                <Clock className="mr-2 h-5 w-5" /> Rent Now
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Choose Mode Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">How would you like to shop?</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Buy Card */}
          <motion.div 
            className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
            whileHover={{ y: -5 }}
            onClick={handleBuyClick}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors z-10" />
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b" 
              alt="Buy Clothes" 
              className="w-full h-96 object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center p-6">
              <h3 className="text-3xl font-bold text-white mb-4">Buy Clothes</h3>
              <p className="text-white/90 mb-6 max-w-xs">
                Own premium clothing pieces to expand your wardrobe permanently.
              </p>
              <Button size="lg">
                <ShoppingBag className="mr-2 h-5 w-5" /> Shop Now
              </Button>
            </div>
          </motion.div>
          
          {/* Rent Card */}
          <motion.div 
            className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
            whileHover={{ y: -5 }}
            onClick={handleRentClick}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors z-10" />
            <img 
              src="https://images.unsplash.com/photo-1511130558090-00af810c21b1" 
              alt="Rent Clothes" 
              className="w-full h-96 object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center p-6">
              <h3 className="text-3xl font-bold text-white mb-4">Rent Clothes</h3>
              <p className="text-white/90 mb-6 max-w-xs">
                Borrow designer outfits for special occasions without the full cost.
              </p>
              <Button size="lg">
                <Clock className="mr-2 h-5 w-5" /> Rent Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-lg border">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-muted-foreground">Get your clothes delivered quickly and securely to your doorstep.</p>
          </div>
          
          <div className="p-6 rounded-lg border">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
            <p className="text-muted-foreground">Competitive pricing for both purchasing and renting premium clothing.</p>
          </div>
          
          <div className="p-6 rounded-lg border">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
            <p className="text-muted-foreground">All our products are quality checked and hygienically cleaned after each rental.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
