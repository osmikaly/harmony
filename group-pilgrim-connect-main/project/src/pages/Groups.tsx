
import React from 'react';
import { Layout } from '@/components/Layout';
import { GroupList } from '@/components/groups/GroupList';
import { useAppContext } from '@/context/AppContext';

const Groups: React.FC = () => {
  const { language } = useAppContext();
  
  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          {language === 'en' ? 'Groups' : 'المجموعات'}
        </h2>
        <GroupList />
      </div>
    </Layout>
  );
};

export default Groups;
