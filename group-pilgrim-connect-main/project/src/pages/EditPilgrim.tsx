
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { PilgrimForm } from '@/components/pilgrims/PilgrimForm';
import { useAppContext } from '@/context/AppContext';

const EditPilgrim: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { pilgrims } = useAppContext();
  
  const pilgrimId = parseInt(id || '0');
  const pilgrim = pilgrims.find(p => p.id === pilgrimId);
  
  if (!pilgrim) {
    return <Navigate to="/pilgrims" />;
  }
  
  return (
    <Layout>
      <PilgrimForm initialData={pilgrim} />
    </Layout>
  );
};

export default EditPilgrim;
