
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  ShoppingBag, 
  Clock, 
  Users, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Home,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ open, setOpen }) => {
  const { signOut } = useStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div 
      className={cn(
        "h-screen bg-background border-r transition-all duration-300 flex flex-col",
        open ? "w-64" : "w-20"
      )}
    >
      <div className="h-16 border-b flex items-center px-4 justify-between">
        <div className={cn("font-bold text-xl flex items-center", !open && "hidden")}>
          Admin<span className="text-primary">Panel</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setOpen(!open)}
          className="ml-auto"
        >
          {open ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>
      
      <nav className="flex-1 py-4 px-2 space-y-1">
        <NavItem to="/admin" icon={<LayoutDashboard />} label="Dashboard" open={open} />
        <NavItem to="/admin/products" icon={<Package />} label="Products" open={open} />
        <NavItem to="/admin/buy-orders" icon={<ShoppingBag />} label="Buy Orders" open={open} />
        <NavItem to="/admin/rent-orders" icon={<Clock />} label="Rent Orders" open={open} />
        <NavItem to="/admin/customers" icon={<Users />} label="Customers" open={open} />
        <NavItem to="/admin/settings" icon={<Settings />} label="Settings" open={open} />
        <NavItem to="/" icon={<Home />} label="Back to Shop" open={open} />
      </nav>
      
      <div className="p-2 border-t mt-auto">
        <Button 
          variant="ghost" 
          className={cn("w-full justify-start", !open && "justify-center px-0")}
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {open && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  open: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, open }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => cn(
        "flex items-center py-2 px-3 rounded-md transition-colors",
        isActive ? "bg-primary/10 text-primary" : "hover:bg-muted",
        !open && "justify-center px-0"
      )}
      end={to === "/admin"}
    >
      <div className={cn("mr-2", !open && "mr-0")}>{icon}</div>
      {open && <span>{label}</span>}
    </NavLink>
  );
};

export default AdminSidebar;
