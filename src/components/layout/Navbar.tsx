
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  ShoppingBag, 
  Clock,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar: React.FC = () => {
  const { mode, setMode, buyCart, rentCart, user, isAdmin, signOut } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const cartCount = mode === 'buy' ? 
    buyCart.reduce((total, item) => total + item.quantity, 0) : 
    rentCart.length;
  
  const toggleMode = () => {
    setMode(mode === 'buy' ? 'rent' : 'buy');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold text-xl md:text-2xl">
            Clothing<span className="text-primary">Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 ml-6">
            <NavLink 
              to="/"
              className={({isActive}) => 
                `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to={`/${mode === 'buy' ? 'shop' : 'rent'}`}
              className={({isActive}) => 
                `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
              }
            >
              {mode === 'buy' ? 'Shop' : 'Rent'}
            </NavLink>
            <NavLink 
              to="/about"
              className={({isActive}) => 
                `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
              }
            >
              About
            </NavLink>
            <NavLink 
              to="/contact"
              className={({isActive}) => 
                `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
              }
            >
              Contact
            </NavLink>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Mode toggle */}
          <div className="hidden md:flex items-center gap-2">
            <span className={`text-sm ${mode === 'buy' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Buy</span>
            <Switch 
              checked={mode === 'rent'}
              onCheckedChange={toggleMode}
              aria-label="Toggle shopping mode"
            />
            <span className={`text-sm ${mode === 'rent' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Rent</span>
          </div>
          
          {/* Cart button */}
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate(`/${mode === 'buy' ? 'cart' : 'rental-cart'}`)}
            className="relative"
          >
            {mode === 'buy' ? <ShoppingBag className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-5 min-h-5 flex items-center justify-center">
                {cartCount}
              </Badge>
            )}
          </Button>
          
          {/* User menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/${mode === 'buy' ? 'orders' : 'rentals'}`)}>
                  {mode === 'buy' ? 'Orders' : 'Rentals'}
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          )}
          
          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col space-y-4">
            <NavLink 
              to="/"
              className={({isActive}) => 
                `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to={`/${mode === 'buy' ? 'shop' : 'rent'}`}
              className={({isActive}) => 
                `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              {mode === 'buy' ? 'Shop' : 'Rent'}
            </NavLink>
            <NavLink 
              to="/about"
              className={({isActive}) => 
                `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </NavLink>
            <NavLink 
              to="/contact"
              className={({isActive}) => 
                `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </NavLink>
            
            {/* Mobile mode toggle */}
            <div className="flex items-center gap-2 pt-2">
              <span className={`text-sm ${mode === 'buy' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Buy</span>
              <Switch 
                checked={mode === 'rent'}
                onCheckedChange={toggleMode}
                aria-label="Toggle shopping mode"
              />
              <span className={`text-sm ${mode === 'rent' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Rent</span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
