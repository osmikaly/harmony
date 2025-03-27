
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { GroupForm } from '@/components/groups/GroupForm';
import { useAppContext } from '@/context/AppContext';

const EditGroup: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { groups } = useAppContext();
  
  const groupId = parseInt(id || '0');
  const group = groups.find(g => g.id === groupId);
  
  if (!group) {
    return <Navigate to="/groups" />;
  }
  
  return (
    <Layout>
      <GroupForm initialData={group} />
    </Layout>
  );
};

export default EditGroup;
