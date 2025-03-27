import React from 'react';
import { Layout } from '@/components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { GroupPilgrimsListReadOnly } from '@/components/groups/GroupPilgrimsListReadOnly';

const GroupPilgrimsReadOnly: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { groups, language } = useAppContext();
  const navigate = useNavigate();
  
  const groupId = Number(id);
  const group = groups.find(g => g.id === groupId);
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/groups-readonly')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            {language === 'en' 
              ? `Pilgrims in Group: ${group?.name || ''} (View Only)` 
              : `المعتمرين في المجموعة: ${group?.name || ''} (عرض فقط)`}
          </h2>
        </div>
        <GroupPilgrimsListReadOnly groupId={groupId} />
      </div>
    </Layout>
  );
};

export default GroupPilgrimsReadOnly;
