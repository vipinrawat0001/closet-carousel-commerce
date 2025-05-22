
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import AdminSidebar from './AdminSidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const AdminLayout = () => {
  const { user, isAdmin, loading } = useStore();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

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
        <header className="border-b h-16 flex items-center px-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-4"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">Admin Dashboard</h1>
        </header>
        
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
