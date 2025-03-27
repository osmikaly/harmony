import React from 'react';
import { Layout } from '@/components/Layout';
import { PilgrimList } from '@/components/pilgrims/PilgrimList';
import { useAppContext } from '@/context/AppContext';

const Pilgrims: React.FC = () => {
  const { language } = useAppContext();
  
  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          {language === 'en' ? 'Pilgrims' : 'المعتمرين'}
        </h2>
        <PilgrimList />
      </div>
    </Layout>
  );
};

export default Pilgrims;
