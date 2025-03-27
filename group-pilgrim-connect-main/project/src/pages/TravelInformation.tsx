
import React, { Suspense } from 'react';
import { Layout } from '@/components/Layout';
import { useAppContext } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load the TravelInfoList component
const TravelInfoList = React.lazy(() => 
  import('@/components/pilgrims/TravelInfoList').then(module => ({ 
    default: module.TravelInfoList 
  }))
);

const LoadingFallback = () => (
  <div className="space-y-4">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-[500px] w-full" />
  </div>
);

const TravelInformation: React.FC = () => {
  const { language } = useAppContext();
  
  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          {language === 'en' ? 'Travel Information' : 'معلومات السفر'}
        </h2>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              {language === 'en' ? 'All Travel Info' : 'جميع معلومات السفر'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <Suspense fallback={<LoadingFallback />}>
              <TravelInfoList />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TravelInformation;
