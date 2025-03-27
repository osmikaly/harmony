
import React from 'react';
import { Layout } from '@/components/Layout';
import { GroupListReadOnly } from '@/components/groups/GroupListReadOnly';
import { useAppContext } from '@/context/AppContext';

const GroupsReadOnly: React.FC = () => {
  const { language } = useAppContext();
  
  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          {language === 'en' ? 'Groups (View Only)' : 'المجموعات (عرض فقط)'}
        </h2>
        <GroupListReadOnly />
      </div>
    </Layout>
  );
};

export default GroupsReadOnly;
