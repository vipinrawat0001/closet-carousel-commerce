
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle } from 'lucide-react';

const DatabaseConnectionCheck = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [message, setMessage] = useState('Checking database connection...');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Try to fetch the count of products
        const { count, error } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        
        setStatus('connected');
        setMessage(`Connected to database. Found ${count || 0} products.`);
      } catch (error) {
        console.error('Database connection error:', error);
        setStatus('error');
        setMessage('Failed to connect to database. Check console for details.');
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="flex items-center space-x-2">
      {status === 'checking' && (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Checking...
        </Badge>
      )}
      
      {status === 'connected' && (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center">
          <CheckCircle className="h-3.5 w-3.5 mr-1" />
          Connected
        </Badge>
      )}
      
      {status === 'error' && (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center">
          <AlertCircle className="h-3.5 w-3.5 mr-1" />
          Error
        </Badge>
      )}
      
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  );
};

export default DatabaseConnectionCheck;
