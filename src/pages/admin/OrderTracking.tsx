
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { toast } from '@/components/ui/use-toast';
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Calendar,
  Filter,
  ArrowUpDown,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

// Define the allowed status types
type BuyOrderStatus = 'Pending' | 'Packed' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
type RentOrderStatus = 'Booked' | 'Out for Delivery' | 'Active' | 'Returned' | 'Cancelled';

interface Order {
  id: string;
  user_id: string;
  status: BuyOrderStatus; // Use the defined type here
  total_amount: number;
  created_at: string;
  updated_at: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
}

interface RentalOrder {
  id: string;
  user_id: string;
  status: RentOrderStatus; // Use the defined type here
  total_rent_amount: number;
  total_deposit: number;
  created_at: string;
  rent_start_date: string;
  rent_end_date: string;
}

const OrderTracking = () => {
  const [orderType, setOrderType] = useState<'buy' | 'rent'>('buy');
  const [buyOrders, setBuyOrders] = useState<Order[]>([]);
  const [rentOrders, setRentOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Define the allowed statuses as constants
  const buyOrderStatuses: BuyOrderStatus[] = ['Pending', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'];
  const rentOrderStatuses: RentOrderStatus[] = ['Booked', 'Out for Delivery', 'Active', 'Returned', 'Cancelled'];

  useEffect(() => {
    if (orderType === 'buy') {
      fetchBuyOrders();
    } else {
      fetchRentOrders();
    }
  }, [orderType]);

  const fetchBuyOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('buy_orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Ensure the data conforms to our expected type
      const typedData = data?.map(order => ({
        ...order,
        status: order.status as BuyOrderStatus
      })) || [];
      
      setBuyOrders(typedData);
    } catch (error) {
      console.error('Error fetching buy orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load buy orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRentOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rent_orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Ensure the data conforms to our expected type
      const typedData = data?.map(order => ({
        ...order,
        status: order.status as RentOrderStatus
      })) || [];
      
      setRentOrders(typedData);
    } catch (error) {
      console.error('Error fetching rent orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load rent orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBuyOrderStatus = async (orderId: string, newStatus: BuyOrderStatus) => {
    try {
      const { error } = await supabase
        .from('buy_orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      
      if (error) throw error;
      
      setBuyOrders(orders => 
        orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      toast({
        title: 'Order updated',
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  const updateRentOrderStatus = async (orderId: string, newStatus: RentOrderStatus) => {
    try {
      const { error } = await supabase
        .from('rent_orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      
      if (error) throw error;
      
      setRentOrders(orders => 
        orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      toast({
        title: 'Rental updated',
        description: `Rental status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating rental status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update rental status',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Pending':
      case 'Booked':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Packed':
      case 'Out for Delivery':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Delivered':
      case 'Active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Returned':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredBuyOrders = buyOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredRentOrders = rentOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Order Tracking</h1>
        <Tabs value={orderType} onValueChange={(value) => setOrderType(value as 'buy' | 'rent')}>
          <TabsList>
            <TabsTrigger value="buy">Buy Orders</TabsTrigger>
            <TabsTrigger value="rent">Rental Orders</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by order ID..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {orderType === 'buy' ? (
              buyOrderStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))
            ) : (
              rentOrderStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {orderType === 'buy' ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Shipping Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : filteredBuyOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBuyOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.slice(0, 8)}...</TableCell>
                    <TableCell>{format(new Date(order.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getStatusBadgeVariant(order.status)}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {`${order.shipping_address}, ${order.shipping_city}, ${order.shipping_state} ${order.shipping_postal_code}`}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            Update Status
                          </DropdownMenuItem>
                          {buyOrderStatuses.map(status => (
                            <DropdownMenuItem 
                              key={status}
                              disabled={order.status === status}
                              onClick={() => updateBuyOrderStatus(order.id, status)}
                              className="pl-8"
                            >
                              {status}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rental ID</TableHead>
                <TableHead>Booking Date</TableHead>
                <TableHead>Rental Period</TableHead>
                <TableHead>Rent Amount</TableHead>
                <TableHead>Deposit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading rentals...
                  </TableCell>
                </TableRow>
              ) : filteredRentOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No rentals found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.slice(0, 8)}...</TableCell>
                    <TableCell>{format(new Date(order.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      {format(new Date(order.rent_start_date), 'MMM d')} - {format(new Date(order.rent_end_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>${order.total_rent_amount.toFixed(2)}</TableCell>
                    <TableCell>${order.total_deposit.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getStatusBadgeVariant(order.status)}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            Update Status
                          </DropdownMenuItem>
                          {rentOrderStatuses.map(status => (
                            <DropdownMenuItem 
                              key={status}
                              disabled={order.status === status}
                              onClick={() => updateRentOrderStatus(order.id, status)}
                              className="pl-8"
                            >
                              {status}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
