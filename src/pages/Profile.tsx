
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';

const Profile = () => {
  const { user, profile, signOut } = useStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else if (profile) {
      // Initialize form with profile data
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        postal_code: profile.postal_code || '',
        country: profile.country || '',
        phone: profile.phone || '',
      });
    }
  }, [user, profile, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      });
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: passwordForm.newPassword,
      });
        
      if (error) throw error;
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Password update failed",
        description: "There was a problem updating your password.",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase.auth.admin.deleteUser(user!.id);
        
      if (error) throw error;
      
      await signOut();
      
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Deletion failed",
        description: "There was a problem deleting your account.",
        variant: "destructive",
      });
    }
  };

  if (!user || !profile) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile.avatar_url || ''} alt={profile.first_name} />
          <AvatarFallback>
            {profile.first_name ? profile.first_name.charAt(0) : user.email?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">
            {profile.first_name ? `${profile.first_name} ${profile.last_name}` : 'My Account'}
          </h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          {profile.role === 'admin' && (
            <TabsTrigger value="admin">Admin</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileUpdate}>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input 
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input 
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input 
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State or province"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input 
                      id="postal_code"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      placeholder="Postal code"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => navigate('/')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordUpdate}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your current password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm your new password"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={passwordLoading}>
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>
                  Permanently delete your account and all your data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Once you delete your account, there is no going back. This action cannot be undone.
                </p>
                <Button variant="destructive" onClick={handleAccountDeletion}>
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {profile.role === 'admin' && (
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>
                  Access administrative features and settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/admin')}>
                  Go to Admin Dashboard
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Profile;
