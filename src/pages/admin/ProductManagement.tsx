
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Eye
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Product = {
  id: string;
  name: string;
  category: string;
  gender: string;
  purchase_price: number;
  rental_price_daily: number | null;
  is_purchasable: boolean;
  is_rentable: boolean;
  created_at: string;
};

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [productType, setProductType] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [productType]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase.from('products').select('*');
      
      if (productType === 'buy') {
        query = query.eq('is_purchasable', true);
      } else if (productType === 'rent') {
        query = query.eq('is_rentable', true);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('Products fetched:', data);
      setProducts(data || []);
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      
      if (error) throw error;
      
      setProducts(products.filter(product => product.id !== id));
      toast({
        title: 'Product deleted',
        description: 'The product has been successfully deleted',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Button onClick={() => navigate('/admin/products/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs 
          value={productType} 
          onValueChange={setProductType}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-3 w-full sm:w-[300px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="rent">Rent</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Buy Price</TableHead>
              <TableHead>Rent Price</TableHead>
              <TableHead>Available As</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.gender}</TableCell>
                  <TableCell>
                    {product.is_purchasable 
                      ? `$${product.purchase_price.toFixed(2)}` 
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {product.is_rentable && product.rental_price_daily 
                      ? `$${product.rental_price_daily.toFixed(2)}/day` 
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {product.is_purchasable && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Buy
                        </Badge>
                      )}
                      {product.is_rentable && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Rent
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/product/${product.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/admin/products/edit/${product.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductManagement;
