
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Lock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminAuth = () => {
  const { signIn, user, isAdmin } = useStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    } else if (user && !isAdmin) {
      // If logged in but not admin
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Check if user is admin
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) throw profileError;
      
      if (profileData.role !== 'admin') {
        // Sign out if not admin
        await supabase.auth.signOut();
        throw new Error("You don't have admin privileges");
      }
      
      // If successful, toast and redirect handled by useEffect
      toast({
        title: "Welcome Admin",
        description: "You have successfully signed in to the admin dashboard",
      });
    } catch (error: any) {
      console.error('Admin sign in error:', error);
      setErrorMessage(error.message || "Failed to sign in");
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (user && isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignIn}>
          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required autoComplete="current-password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminAuth;
