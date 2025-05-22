
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { X, Filter } from 'lucide-react';

// Define types
type Product = {
  id: string;
  name: string;
  description: string;
  gender: string;
  category: string;
  color: string;
  purchase_price: number;
  rental_price_daily: number | null;
  rental_deposit: number | null;
  is_purchasable: boolean;
  is_rentable: boolean;
  images: { image_url: string }[];
};

type FilterState = {
  categories: string[];
  genders: string[];
  colors: string[];
  minPrice: number;
  maxPrice: number;
  search: string;
};

const Shop = () => {
  const { mode } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    genders: [],
    colors: [],
    minPrice: 0,
    maxPrice: 500,
    search: '',
  });

  // Filter options
  const categoryOptions = [
    'T-shirts', 'Shirts', 'Trousers', 'Jeans', 'Shorts', 'Dresses', 
    'Skirts', 'Sarees', 'Suits', 'Sherwanis', 'Jackets', 'Coats', 
    'Hoodies', 'Blazers', 'Sweatshirts', 'Ethnic', 'Formal', 
    'Casual', 'Loungewear', 'Activewear'
  ];
  
  const genderOptions = ['Men', 'Women', 'Unisex'];
  
  const colorOptions = ['Black', 'White', 'Red', 'Green', 'Blue', 'Yellow', 'Pink', 'Purple', 'Brown', 'Gray'];

  // Initialize filters from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const genderParam = searchParams.get('gender');
    const colorParam = searchParams.get('color');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const searchParam = searchParams.get('search');
    
    setFilters({
      categories: categoryParam ? categoryParam.split(',') : [],
      genders: genderParam ? genderParam.split(',') : [],
      colors: colorParam ? colorParam.split(',') : [],
      minPrice: minPriceParam ? parseInt(minPriceParam) : 0,
      maxPrice: maxPriceParam ? parseInt(maxPriceParam) : 500,
      search: searchParam || '',
    });
  }, [searchParams]);

  // Fetch products on component mount and when mode changes
  useEffect(() => {
    fetchProducts();
  }, [mode]);
  
  // Update filters when search params change
  useEffect(() => {
    applyFilters();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Build query
      let query = supabase
        .from('products')
        .select(`
          id, 
          name,
          description, 
          gender, 
          category, 
          color, 
          purchase_price,
          rental_price_daily,
          rental_deposit,
          is_purchasable,
          is_rentable,
          product_images (image_url)
        `);
        
      // Filter by mode
      if (mode === 'buy') {
        query = query.eq('is_purchasable', true);
      } else {
        query = query.eq('is_rentable', true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const productsWithImages = data.map(product => ({
        ...product,
        images: product.product_images
      }));
      
      setProducts(productsWithImages);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and update URL
  const applyFilters = () => {
    const newParams = new URLSearchParams();
    
    if (filters.categories.length > 0) {
      newParams.set('category', filters.categories.join(','));
    }
    
    if (filters.genders.length > 0) {
      newParams.set('gender', filters.genders.join(','));
    }
    
    if (filters.colors.length > 0) {
      newParams.set('color', filters.colors.join(','));
    }
    
    if (filters.minPrice > 0) {
      newParams.set('minPrice', filters.minPrice.toString());
    }
    
    if (filters.maxPrice < 500) {
      newParams.set('maxPrice', filters.maxPrice.toString());
    }
    
    if (filters.search) {
      newParams.set('search', filters.search);
    }
    
    setSearchParams(newParams);
  };

  // Update individual filters
  const handleCategoryChange = (category: string) => {
    setFilters(prev => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories };
    });
  };

  const handleGenderChange = (gender: string) => {
    setFilters(prev => {
      const genders = prev.genders.includes(gender)
        ? prev.genders.filter(g => g !== gender)
        : [...prev.genders, gender];
      return { ...prev, genders };
    });
  };

  const handleColorChange = (color: string) => {
    setFilters(prev => {
      const colors = prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors };
    });
  };

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1],
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      genders: [],
      colors: [],
      minPrice: 0,
      maxPrice: 500,
      search: '',
    });
  };

  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    // Filter by search term
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }
    
    // Filter by gender
    if (filters.genders.length > 0 && !filters.genders.includes(product.gender)) {
      return false;
    }
    
    // Filter by color
    if (filters.colors.length > 0 && !filters.colors.includes(product.color)) {
      return false;
    }
    
    // Filter by price
    const price = mode === 'buy' ? product.purchase_price : product.rental_price_daily || 0;
    if (price < filters.minPrice || price > filters.maxPrice) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">
        {mode === 'buy' ? 'Shop' : 'Rent'} {filters.search && `"${filters.search}"`}
      </h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile filter button */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <Button variant="outline" onClick={() => setMobileFiltersOpen(true)}>
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
          <div className="text-sm text-muted-foreground">
            {filteredProducts.length} products
          </div>
        </div>
        
        {/* Filters sidebar - Mobile */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-background p-4 lg:hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setMobileFiltersOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="overflow-y-auto h-[calc(100vh-6rem)]">
              {/* Filter content - shared with desktop */}
              {renderFilterContent()}
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={clearFilters}>
                Clear All
              </Button>
              <Button className="flex-1" onClick={() => setMobileFiltersOpen(false)}>
                View Results
              </Button>
            </div>
          </div>
        )}
        
        {/* Filters sidebar - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="ghost" className="text-muted-foreground text-xs h-auto p-0" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
            
            {/* Filter content - shared with mobile */}
            {renderFilterContent()}
          </div>
        </div>
        
        {/* Products grid */}
        <div className="flex-1">
          {/* Active filters */}
          {(filters.categories.length > 0 || 
            filters.genders.length > 0 || 
            filters.colors.length > 0 || 
            filters.minPrice > 0 || 
            filters.maxPrice < 500) && (
            <div className="mb-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              
              {filters.categories.map(category => (
                <Badge key={category} variant="secondary" className="cursor-pointer" onClick={() => handleCategoryChange(category)}>
                  {category} <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
              
              {filters.genders.map(gender => (
                <Badge key={gender} variant="secondary" className="cursor-pointer" onClick={() => handleGenderChange(gender)}>
                  {gender} <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
              
              {filters.colors.map(color => (
                <Badge key={color} variant="secondary" className="cursor-pointer" onClick={() => handleColorChange(color)}>
                  {color} <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
              
              {(filters.minPrice > 0 || filters.maxPrice < 500) && (
                <Badge variant="secondary">
                  ${filters.minPrice} - ${filters.maxPrice}
                </Badge>
              )}
            </div>
          )}
          
          {/* Product count and sort */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </div>
            <select className="text-sm border rounded px-2 py-1">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-md aspect-[3/4] mb-4"></div>
                  <div className="bg-muted h-4 rounded mb-2 w-2/3"></div>
                  <div className="bg-muted h-4 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search criteria.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  // Shared filter content renderer
  function renderFilterContent() {
    return (
      <div className="space-y-6">
        {/* Search */}
        <div>
          <h3 className="text-sm font-medium mb-2">Search</h3>
          <Input 
            placeholder="Search products..." 
            value={filters.search} 
            onChange={handleSearchChange} 
          />
        </div>
        
        <Separator />
        
        {/* Price Range */}
        <div>
          <h3 className="text-sm font-medium mb-4">Price</h3>
          <Slider 
            min={0} 
            max={500} 
            step={10} 
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={handlePriceChange}
            className="mb-6"
          />
          <div className="flex items-center justify-between text-sm">
            <span>${filters.minPrice}</span>
            <span>${filters.maxPrice}+</span>
          </div>
        </div>
        
        <Separator />
        
        {/* Categories */}
        <Accordion type="multiple" defaultValue={['categories']}>
          <AccordionItem value="categories">
            <AccordionTrigger className="text-sm font-medium">Categories</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categoryOptions.map(category => (
                  <div key={category} className="flex items-center gap-2">
                    <Checkbox 
                      id={`category-${category}`} 
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Separator />
        
        {/* Gender */}
        <div>
          <h3 className="text-sm font-medium mb-4">Gender</h3>
          <div className="space-y-2">
            {genderOptions.map(gender => (
              <div key={gender} className="flex items-center gap-2">
                <Checkbox 
                  id={`gender-${gender}`} 
                  checked={filters.genders.includes(gender)}
                  onCheckedChange={() => handleGenderChange(gender)}
                />
                <label htmlFor={`gender-${gender}`} className="text-sm cursor-pointer">
                  {gender}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        {/* Colors */}
        <Accordion type="multiple" defaultValue={['colors']}>
          <AccordionItem value="colors">
            <AccordionTrigger className="text-sm font-medium">Colors</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {colorOptions.map(color => (
                  <div key={color} className="flex items-center gap-2">
                    <Checkbox 
                      id={`color-${color}`} 
                      checked={filters.colors.includes(color)}
                      onCheckedChange={() => handleColorChange(color)}
                    />
                    <label htmlFor={`color-${color}`} className="text-sm cursor-pointer">
                      {color}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
};

export default Shop;
