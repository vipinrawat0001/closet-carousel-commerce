
import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import AdminSidebar from './AdminSidebar';
import DatabaseConnectionCheck from '@/components/admin/DatabaseConnectionCheck';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AdminLayout = () => {
  const { user, isAdmin, loading } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is admin
    if (user && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges",
        variant: "destructive",
      });
    }
  }, [user, isAdmin]);

  // Show loading state
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Redirect if not logged in or not admin
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <header className="border-b h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-4"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold">Admin Dashboard</h1>
          </div>
          
          <div>
            <DatabaseConnectionCheck />
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
