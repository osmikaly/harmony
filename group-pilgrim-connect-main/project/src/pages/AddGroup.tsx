
import React from 'react';
import { Layout } from '@/components/Layout';
import { GroupForm } from '@/components/groups/GroupForm';

const AddGroup: React.FC = () => {
  return (
    <Layout>
      <GroupForm />
    </Layout>
  );
};

export default AddGroup;
