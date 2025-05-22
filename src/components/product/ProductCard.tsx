
import React from 'react';
import { Link } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    gender: string;
    category: string;
    purchase_price: number;
    rental_price_daily?: number;
    rental_deposit?: number;
    is_purchasable: boolean;
    is_rentable: boolean;
    images: { image_url: string }[];
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { mode } = useStore();
  
  // Check if the product is available for the current mode
  const isAvailable = mode === 'buy' ? product.is_purchasable : product.is_rentable;
  
  if (!isAvailable) return null;
  
  const thumbnailImage = product.images && product.images.length > 0 
    ? product.images[0].image_url 
    : 'https://placehold.co/300x400?text=No+Image';
  
  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-90 transition-opacity">
        <AspectRatio ratio={3/4}>
          <img 
            src={thumbnailImage} 
            alt={product.name} 
            className="h-full w-full object-cover object-center"
          />
        </AspectRatio>
        
        {/* Quick view button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Link to={`/product/${product.id}`}>
            <Button variant="secondary" size="sm" className="shadow-md">
              Quick View
            </Button>
          </Link>
        </div>
        
        {/* Wishlist button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
        
        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/80 text-foreground">
            {product.gender} {product.category}
          </Badge>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium">
          <Link to={`/product/${product.id}`} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <div className="mt-1 flex justify-between items-center">
          {mode === 'buy' ? (
            <p className="text-sm font-medium text-foreground">
              ${product.purchase_price.toFixed(2)}
            </p>
          ) : (
            <div className="flex flex-col">
              <p className="text-sm font-medium text-foreground">
                ${product.rental_price_daily?.toFixed(2)}/day
              </p>
              <p className="text-xs text-muted-foreground">
                ${product.rental_deposit?.toFixed(2)} deposit
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
