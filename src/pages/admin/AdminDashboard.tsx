
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingBag, 
  Clock, 
  Users, 
  Package, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBuyOrders: 0,
    totalRentOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockProducts: 0
  });
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [ordersData, setOrdersData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch buy orders count
        const { count: buyOrdersCount } = await supabase
          .from('buy_orders')
          .select('*', { count: 'exact', head: true });

        // Fetch rent orders count
        const { count: rentOrdersCount } = await supabase
          .from('rent_orders')
          .select('*', { count: 'exact', head: true });

        // Fetch customers count
        const { count: customersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'customer');

        // Fetch products count
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // Fetch low stock products
        const { count: lowStockCount } = await supabase
          .from('inventory')
          .select('*', { count: 'exact', head: true })
          .or('buy_stock.lte.5,rent_stock.lte.2');

        // Fetch sales data for the chart
        // This is example data - you would fetch actual data from your database
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const sampleSalesData = months.map(month => ({
          name: month,
          Sales: Math.floor(Math.random() * 100),
          Rentals: Math.floor(Math.random() * 50)
        }));
        
        // Example orders data
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const sampleOrdersData = days.map(day => ({
          name: day,
          Orders: Math.floor(Math.random() * 20)
        }));

        setSalesData(sampleSalesData);
        setOrdersData(sampleOrdersData);
        setStats({
          totalBuyOrders: buyOrdersCount || 0,
          totalRentOrders: rentOrdersCount || 0,
          totalCustomers: customersCount || 0,
          totalProducts: productsCount || 0,
          lowStockProducts: lowStockCount || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package className="h-8 w-8 text-primary" />}
        />
        <StatCard
          title="Buy Orders"
          value={stats.totalBuyOrders}
          icon={<ShoppingBag className="h-8 w-8 text-primary" />}
        />
        <StatCard
          title="Rent Orders"
          value={stats.totalRentOrders}
          icon={<Clock className="h-8 w-8 text-primary" />}
        />
        <StatCard
          title="Customers"
          value={stats.totalCustomers}
          icon={<Users className="h-8 w-8 text-primary" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bar">
              <TabsList className="mb-4">
                <TabsTrigger value="bar">Bar</TabsTrigger>
                <TabsTrigger value="line">Line</TabsTrigger>
              </TabsList>
              <TabsContent value="bar">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="Sales" fill="rgba(99, 102, 241, 0.5)" />
                      <Bar dataKey="Rentals" fill="rgba(14, 165, 233, 0.5)" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="line">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={ordersData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="Orders" stroke="rgb(99, 102, 241)" strokeWidth={2} dot={{ r: 4 }} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Products</p>
                <p className="text-2xl font-semibold">{stats.lowStockProducts}</p>
              </div>
              <div className="p-2 bg-amber-100 text-amber-600 rounded-full">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
            <div className="p-4 border rounded-md">
              <p className="text-sm">
                {stats.lowStockProducts > 0
                  ? `You have ${stats.lowStockProducts} products with low inventory levels that need attention.`
                  : 'All inventory levels are healthy. No action needed at this time.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
