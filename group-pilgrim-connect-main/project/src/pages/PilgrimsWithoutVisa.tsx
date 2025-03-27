import React from 'react';
import { Layout } from '@/components/Layout';
import { useAppContext } from '@/context/AppContext';
import { GroupsWithoutVisaList } from '@/components/pilgrims/GroupsWithoutVisaList';

const PilgrimsWithoutVisa: React.FC = () => {
  const { language } = useAppContext();
  
  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          {language === 'en' ? 'Groups with Pilgrims Without Visa' : 'المجموعات بمعتمرين بدون تأشيرة'}
        </h2>
        <GroupsWithoutVisaList />
      </div>
    </Layout>
  );
};

export default PilgrimsWithoutVisa;
