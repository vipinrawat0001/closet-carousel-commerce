
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type ProductCategory = Database['public']['Enums']['product_category'];
type GenderType = Database['public']['Enums']['gender_type'];

interface ProductFormData {
  name: string;
  description: string;
  category: ProductCategory;
  gender: GenderType;
  color: string;
  material: string;
  purchase_price: number;
  is_purchasable: boolean;
  is_rentable: boolean;
  rental_price_daily: number | null;
  rental_deposit: number | null;
  rental_max_days: number | null;
  sku: string;
  season: string;
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  category: 'Casual',
  gender: 'Unisex',
  color: '',
  material: '',
  purchase_price: 0,
  is_purchasable: true,
  is_rentable: false,
  rental_price_daily: null,
  rental_deposit: null,
  rental_max_days: null,
  sku: '',
  season: '',
};

const ProductEditor = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [genders, setGenders] = useState<GenderType[]>([]);
  
  useEffect(() => {
    // Fetch enum values
    const fetchEnums = async () => {
      try {
        const { data: categoryData } = await supabase.rpc('get_enum_values', { enum_name: 'product_category' });
        const { data: genderData } = await supabase.rpc('get_enum_values', { enum_name: 'gender_type' });
        
        if (categoryData) setCategories(categoryData as ProductCategory[]);
        if (genderData) setGenders(genderData as GenderType[]);
      } catch (error) {
        console.error('Error fetching enums:', error);
      }
    };
    
    fetchEnums();
    
    // If editing, fetch product data
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);
  
  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setFormData({
          name: data.name,
          description: data.description,
          category: data.category,
          gender: data.gender,
          color: data.color,
          material: data.material || '',
          purchase_price: data.purchase_price,
          is_purchasable: data.is_purchasable || false,
          is_rentable: data.is_rentable || false,
          rental_price_daily: data.rental_price_daily,
          rental_deposit: data.rental_deposit,
          rental_max_days: data.rental_max_days,
          sku: data.sku,
          season: data.season || '',
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Generate SKU if not provided
      if (!formData.sku) {
        formData.sku = `${formData.category.slice(0, 3)}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      }
      
      // If rental is disabled, nullify rental fields
      if (!formData.is_rentable) {
        formData.rental_price_daily = null;
        formData.rental_deposit = null;
        formData.rental_max_days = null;
      }
      
      if (isEditing) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', id);
          
        if (error) throw error;
        
        toast({
          title: 'Product updated',
          description: 'The product has been successfully updated',
        });
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([formData]);
          
        if (error) throw error;
        
        toast({
          title: 'Product created',
          description: 'The product has been successfully created',
        });
      }
      
      // Navigate back to product list
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save product',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate('/admin/products')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    rows={5} 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.length > 0 ? (
                          categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))
                        ) : (
                          <>
                            <SelectItem value="Casual">Casual</SelectItem>
                            <SelectItem value="Formal">Formal</SelectItem>
                            <SelectItem value="Ethnic">Ethnic</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(value) => handleSelectChange('gender', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genders.length > 0 ? (
                          genders.map((gender) => (
                            <SelectItem key={gender} value={gender}>
                              {gender}
                            </SelectItem>
                          ))
                        ) : (
                          <>
                            <SelectItem value="Men">Men</SelectItem>
                            <SelectItem value="Women">Women</SelectItem>
                            <SelectItem value="Unisex">Unisex</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input 
                      id="color" 
                      name="color" 
                      value={formData.color} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Input 
                      id="material" 
                      name="material" 
                      value={formData.material} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="season">Season</Label>
                    <Input 
                      id="season" 
                      name="season" 
                      value={formData.season} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU (Auto-generated if empty)</Label>
                    <Input 
                      id="sku" 
                      name="sku" 
                      value={formData.sku} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_purchasable">Available for Purchase</Label>
                    <p className="text-sm text-muted-foreground">Allow customers to buy this product</p>
                  </div>
                  <Switch 
                    id="is_purchasable" 
                    checked={formData.is_purchasable}
                    onCheckedChange={(checked) => handleSwitchChange('is_purchasable', checked)}
                  />
                </div>
                
                {formData.is_purchasable && (
                  <div className="space-y-2 pl-6 border-l-2 border-primary/10">
                    <Label htmlFor="purchase_price">Purchase Price</Label>
                    <Input 
                      id="purchase_price" 
                      name="purchase_price" 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      value={formData.purchase_price} 
                      onChange={handleInputChange} 
                      required={formData.is_purchasable}
                    />
                  </div>
                )}
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_rentable">Available for Rent</Label>
                    <p className="text-sm text-muted-foreground">Allow customers to rent this product</p>
                  </div>
                  <Switch 
                    id="is_rentable" 
                    checked={formData.is_rentable}
                    onCheckedChange={(checked) => handleSwitchChange('is_rentable', checked)}
                  />
                </div>
                
                {formData.is_rentable && (
                  <div className="space-y-4 pl-6 border-l-2 border-primary/10">
                    <div className="space-y-2">
                      <Label htmlFor="rental_price_daily">Daily Rental Price</Label>
                      <Input 
                        id="rental_price_daily" 
                        name="rental_price_daily" 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        value={formData.rental_price_daily || ''} 
                        onChange={handleInputChange} 
                        required={formData.is_rentable}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rental_deposit">Security Deposit</Label>
                      <Input 
                        id="rental_deposit" 
                        name="rental_deposit" 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        value={formData.rental_deposit || ''} 
                        onChange={handleInputChange} 
                        required={formData.is_rentable}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rental_max_days">Maximum Rental Days</Label>
                      <Input 
                        id="rental_max_days" 
                        name="rental_max_days" 
                        type="number" 
                        min="1" 
                        value={formData.rental_max_days || ''} 
                        onChange={handleInputChange} 
                        required={formData.is_rentable}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8 border-2 border-dashed rounded-md">
                  <p className="text-muted-foreground">
                    Image upload functionality will be implemented in a future update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')} className="mr-2">
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Product
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

const Separator = () => <div className="h-px bg-border my-4" />;

export default ProductEditor;
