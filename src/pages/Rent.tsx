
import React from 'react';
import { useStore } from '@/contexts/StoreContext';
import Shop from './Shop';

const Rent = () => {
  const { setMode } = useStore();
  
  // Set the mode to rent when this component is rendered
  React.useEffect(() => {
    setMode('rent');
  }, [setMode]);
  
  // Reuse Shop component as the structure is the same, just with different mode
  return <Shop />;
};

export default Rent;
