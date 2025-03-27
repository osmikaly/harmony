
import React from 'react';
import { Layout } from '@/components/Layout';
import { Dashboard as DashboardComponent } from '@/components/Dashboard';

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <DashboardComponent />
    </Layout>
  );
};

export default Dashboard;
