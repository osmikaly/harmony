import React from 'react';
import { Layout } from '@/components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { GroupPilgrimsWithoutVisaList } from '@/components/pilgrims/GroupPilgrimsWithoutVisaList';

const GroupPilgrimsWithoutVisa: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { groups, language } = useAppContext();
  const navigate = useNavigate();
  
  const groupId = Number(id);
  const group = groups.find(g => g.id === groupId);
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/pilgrims-without-visa')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            {language === 'en' 
              ? `Pilgrims Without Visa in Group: ${group?.name || ''}` 
              : `المعتمرين بدون تأشيرة في المجموعة: ${group?.name || ''}`}
          </h2>
        </div>
        <GroupPilgrimsWithoutVisaList groupId={groupId} />
      </div>
    </Layout>
  );
};

export default GroupPilgrimsWithoutVisa;
