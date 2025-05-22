
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Calendar,
} from '@/components/ui/calendar';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { ShoppingCart, ThumbsUp, Award, Package } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Product {
  id: string;
  name: string;
  description: string;
  gender: string;
  category: string;
  color: string;
  material: string;
  season: string;
  purchase_price: number;
  rental_price_daily: number;
  rental_deposit: number;
  rental_max_days: number;
  is_purchasable: boolean;
  is_rentable: boolean;
  sku: string;
  inventory: {
    size: string;
    buy_stock: number;
    rent_stock: number;
  }[];
  images: {
    image_url: string;
    image_type: string;
    display_order: number;
  }[];
}

const ProductDetail = () => {
  const { productId } = useParams();
  const { mode, setMode, addToBuyCart, addToRentCart } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [rentDays, setRentDays] = useState(1);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  
  // Fetch product on component mount
  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);
  
  // Update end date when start date or rent days change
  useEffect(() => {
    if (startDate) {
      const newEndDate = new Date(startDate);
      newEndDate.setDate(newEndDate.getDate() + rentDays - 1);
      setEndDate(newEndDate);
    }
  }, [startDate, rentDays]);
  
  const fetchProduct = async (id: string) => {
    setLoading(true);
    try {
      // Fetch product with joined tables
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select(`
          id, 
          name,
          description, 
          gender, 
          category, 
          color, 
          material,
          season,
          purchase_price,
          rental_price_daily,
          rental_deposit,
          rental_max_days,
          is_purchasable,
          is_rentable,
          sku
        `)
        .eq('id', id)
        .single();
        
      if (productError) throw productError;
      
      // Fetch inventory for all sizes
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory')
        .select('size, buy_stock, rent_stock')
        .eq('product_id', id);
        
      if (inventoryError) throw inventoryError;
      
      // Fetch product images
      const { data: imagesData, error: imagesError } = await supabase
        .from('product_images')
        .select('image_url, image_type, display_order')
        .eq('product_id', id)
        .order('display_order');
        
      if (imagesError) throw imagesError;
      
      // Combine all data
      const fullProduct = {
        ...productData,
        inventory: inventoryData,
        images: imagesData,
      };
      
      setProduct(fullProduct);
      
      // Set default selected image
      if (imagesData.length > 0) {
        setSelectedImage(imagesData[0].image_url);
      }
      
      // Check if product is available in the current mode, switch if needed
      const shouldSwitchMode = 
        (mode === 'buy' && !productData.is_purchasable && productData.is_rentable) ||
        (mode === 'rent' && !productData.is_rentable && productData.is_purchasable);
        
      if (shouldSwitchMode) {
        setMode(mode === 'buy' ? 'rent' : 'buy');
        toast({
          title: `Viewing in ${mode === 'buy' ? 'Rent' : 'Buy'} mode`,
          description: `This item is only available to ${mode === 'buy' ? 'rent' : 'buy'}.`,
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToCart = () => {
    if (!product || !selectedSize) {
      toast({
        title: 'Please select a size',
        variant: 'destructive',
      });
      return;
    }
    
    // Find the inventory for the selected size
    const sizeInventory = product.inventory.find(inv => inv.size === selectedSize);
    
    if (!sizeInventory) {
      toast({
        title: 'Size not available',
        variant: 'destructive',
      });
      return;
    }
    
    // Check stock availability based on mode
    const availableStock = mode === 'buy' ? sizeInventory.buy_stock : sizeInventory.rent_stock;
    
    if (availableStock < (mode === 'buy' ? quantity : 1)) {
      toast({
        title: 'Not enough stock',
        description: `Only ${availableStock} item(s) available for this size.`,
        variant: 'destructive',
      });
      return;
    }
    
    if (mode === 'buy') {
      // Add to buy cart
      addToBuyCart({
        id: uuidv4(),
        productId: product.id,
        name: product.name,
        size: selectedSize,
        price: product.purchase_price,
        quantity: quantity,
        image: product.images[0]?.image_url || '',
      });
    } else {
      // For rental, validate dates
      if (!startDate || !endDate) {
        toast({
          title: 'Please select rental dates',
          variant: 'destructive',
        });
        return;
      }
      
      // Add to rent cart
      addToRentCart({
        id: uuidv4(),
        productId: product.id,
        name: product.name,
        size: selectedSize,
        price: product.rental_price_daily * rentDays + product.rental_deposit,
        dailyRate: product.rental_price_daily,
        deposit: product.rental_deposit,
        durationDays: rentDays,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        image: product.images[0]?.image_url || '',
      });
    }
  };
  
  const isOutOfStock = (size: string) => {
    if (!product) return true;
    const sizeInventory = product.inventory.find(inv => inv.size === size);
    if (!sizeInventory) return true;
    return mode === 'buy' 
      ? sizeInventory.buy_stock <= 0 
      : sizeInventory.rent_stock <= 0;
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="container py-12">
        <div className="flex flex-col md:flex-row gap-8 animate-pulse">
          <div className="md:w-1/2">
            <div className="bg-muted rounded-lg aspect-square mb-4"></div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-muted rounded-lg aspect-square"></div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-muted h-8 rounded w-3/4 mb-4"></div>
            <div className="bg-muted h-6 rounded w-1/4 mb-6"></div>
            <div className="bg-muted h-4 rounded mb-2 w-full"></div>
            <div className="bg-muted h-4 rounded mb-2 w-full"></div>
            <div className="bg-muted h-4 rounded mb-6 w-3/4"></div>
            <div className="bg-muted h-10 rounded mb-4 w-1/3"></div>
            <div className="bg-muted h-10 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (!product) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }
  
  // Get available sizes based on mode
  const availableSizes = product.inventory
    .filter(inv => mode === 'buy' ? inv.buy_stock > 0 : inv.rent_stock > 0)
    .map(inv => inv.size);

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images */}
        <div className="md:w-1/2">
          <div className="mb-4">
            <img 
              src={selectedImage || product.images[0]?.image_url || 'https://placehold.co/600x600?text=No+Image'} 
              alt={product.name} 
              className="w-full h-auto rounded-lg object-cover aspect-square"
            />
          </div>
          
          {/* Thumbnail gallery */}
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div 
                key={index} 
                className={`cursor-pointer rounded-md overflow-hidden border-2 ${selectedImage === image.image_url ? 'border-primary' : 'border-transparent'}`}
                onClick={() => setSelectedImage(image.image_url)}
              >
                <img 
                  src={image.image_url} 
                  alt={`${product.name} - ${image.image_type}`} 
                  className="w-full h-auto aspect-square object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="md:w-1/2">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <Badge>{product.gender}</Badge>
          </div>
          
          {mode === 'buy' ? (
            <div className="text-2xl font-semibold mb-6">${product.purchase_price.toFixed(2)}</div>
          ) : (
            <div className="mb-6">
              <div className="text-2xl font-semibold">${product.rental_price_daily.toFixed(2)}/day</div>
              <div className="text-sm text-muted-foreground">+ ${product.rental_deposit.toFixed(2)} refundable deposit</div>
            </div>
          )}
          
          <p className="mb-6">{product.description}</p>
          
          {/* Product attributes */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Category:</span>
              <span className="text-sm">{product.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Color:</span>
              <span className="text-sm">{product.color}</span>
            </div>
            {product.material && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Material:</span>
                <span className="text-sm">{product.material}</span>
              </div>
            )}
            {product.season && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Season:</span>
                <span className="text-sm">{product.season}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">SKU:</span>
              <span className="text-sm">{product.sku}</span>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Size selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Size</Label>
              <Link to="/size-guide" className="text-xs text-muted-foreground hover:text-primary">
                Size Guide
              </Link>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {['S', 'M', 'L', 'XL', 'XXL'].map(size => {
                const outOfStock = isOutOfStock(size);
                return (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    className={`min-w-[40px] ${outOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !outOfStock && setSelectedSize(size)}
                    disabled={outOfStock}
                  >
                    {size}
                  </Button>
                );
              })}
            </div>
            
            {availableSizes.length === 0 && (
              <div className="text-sm text-red-500">
                Out of stock in all sizes for {mode === 'buy' ? 'purchase' : 'rental'}
              </div>
            )}
          </div>
          
          {/* Buy mode: Quantity */}
          {mode === 'buy' && (
            <div className="mb-6">
              <Label className="text-sm font-medium">Quantity</Label>
              <div className="flex items-center mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <div className="px-4">{quantity}</div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          )}
          
          {/* Rent mode: Rental duration */}
          {mode === 'rent' && (
            <div className="mb-6">
              <Label className="text-sm font-medium mb-2 block">Rental Period</Label>
              
              <div className="flex flex-col space-y-2 mb-4">
                <div className="flex flex-wrap gap-2">
                  {[1, 3, 5, 7].map(days => (
                    <Button
                      key={days}
                      variant={rentDays === days ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setRentDays(days);
                        // Make sure we don't exceed max days
                        if (product.rental_max_days && days > product.rental_max_days) {
                          setRentDays(product.rental_max_days);
                          toast({
                            title: `Maximum rental period is ${product.rental_max_days} days`,
                          });
                        }
                      }}
                    >
                      {days} {days === 1 ? 'day' : 'days'}
                    </Button>
                  ))}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Max rental period: {product.rental_max_days} days
                </div>
                
                <div className="flex flex-wrap gap-4 pt-2">
                  <div>
                    <Label className="text-xs mb-1 block">Start Date</Label>
                    <div className="border rounded-md p-2">
                      {startDate ? format(startDate, 'PPP') : 'Select date'}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs mb-1 block">End Date</Label>
                    <div className="border rounded-md p-2">
                      {endDate ? format(endDate, 'PPP') : '-'}
                    </div>
                  </div>
                </div>
                
                <div className="mt-2">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      if (date) {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        
                        // Cannot select dates in the past
                        if (date < today) {
                          toast({
                            title: "Cannot select dates in the past",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        setStartDate(date);
                      }
                    }}
                    className="rounded-md border shadow"
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                  />
                </div>
                
                <div className="text-sm">
                  <span className="font-medium">Total Price: </span>
                  ${(product.rental_price_daily * rentDays).toFixed(2)}
                  <span className="text-muted-foreground"> + ${product.rental_deposit.toFixed(2)} deposit</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Add to cart button */}
          <Button 
            size="lg" 
            className="w-full mb-4"
            onClick={handleAddToCart}
            disabled={!selectedSize || availableSizes.length === 0}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {mode === 'buy' ? 'Add to Cart' : 'Add to Rental Cart'}
          </Button>
          
          {/* Switch mode button */}
          {(mode === 'buy' && product.is_rentable) || (mode === 'rent' && product.is_purchasable) ? (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setMode(mode === 'buy' ? 'rent' : 'buy')}
            >
              Switch to {mode === 'buy' ? 'Rent' : 'Buy'} mode
            </Button>
          ) : null}
          
          {/* Features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-primary" />
              <span className="text-sm">Quality Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="text-sm">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-sm">Top-rated Product</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product details tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full border-b justify-start rounded-none">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details & Care</TabsTrigger>
            <TabsTrigger value="delivery">Delivery & Returns</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6">
            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="details" className="py-6">
            <div className="prose max-w-none">
              <h3>Product Details</h3>
              <ul>
                <li>Material: {product.material || 'Not specified'}</li>
                <li>Color: {product.color}</li>
                <li>Season: {product.season || 'All seasons'}</li>
                <li>Gender: {product.gender}</li>
                <li>Category: {product.category}</li>
              </ul>
              
              <h3>Care Instructions</h3>
              <p>Check the label for specific care instructions. Generally, we recommend:</p>
              <ul>
                <li>Machine wash cold with similar colors</li>
                <li>Do not bleach</li>
                <li>Tumble dry low</li>
                <li>Iron on low heat if necessary</li>
                <li>Do not dry clean</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="delivery" className="py-6">
            <div className="prose max-w-none">
              <h3>Delivery Information</h3>
              <p>We offer the following shipping options:</p>
              <ul>
                <li>Standard Delivery: 3-5 business days (Free on orders over $50)</li>
                <li>Express Delivery: 1-2 business days ($15)</li>
                <li>Same Day Delivery: Available in select cities ($25)</li>
              </ul>
              
              <h3>Returns Policy</h3>
              <p>For purchased items:</p>
              <ul>
                <li>30-day return window for unworn items with tags attached</li>
                <li>Free returns via our prepaid shipping label</li>
                <li>Original payment method will be refunded</li>
              </ul>
              
              <p>For rented items:</p>
              <ul>
                <li>Return by the due date to avoid late fees</li>
                <li>Items must be returned in original condition</li>
                <li>Deposit will be refunded after quality inspection</li>
                <li>Damage fees may apply for stains, tears, or structural damage</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Label component for this page
const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, className, ...props }) => (
  <label className={`text-sm font-medium ${className || ''}`} {...props}>
    {children}
  </label>
);

export default ProductDetail;
