
import React, { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { PilgrimForm } from '@/components/pilgrims/PilgrimForm';
import { useLocation } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const AddPilgrim: React.FC = () => {
  const location = useLocation();
  const [isReady, setIsReady] = React.useState(false);
  
  // Log for debugging
  useEffect(() => {
    console.log('AddPilgrim page query params:', location.search);
    // Add a small delay to ensure the form renders smoothly
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [location]);
  
  return (
    <Layout>
      {isReady ? (
        <PilgrimForm />
      ) : (
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full rounded-md" />
        </div>
      )}
    </Layout>
  );
};

export default AddPilgrim;
