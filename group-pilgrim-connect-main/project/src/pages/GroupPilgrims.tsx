import React, { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { GroupPilgrimsList } from '@/components/groups/GroupPilgrimsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GroupPilgrimsWithoutVisaList } from '@/components/pilgrims/GroupPilgrimsWithoutVisaList';
import { toast } from 'sonner';

const GroupPilgrims: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { groups, pilgrims, language } = useAppContext();
  const navigate = useNavigate();
  
  const groupId = Number(id);
  const group = groups.find(g => g.id === groupId);
  
  // Check if this group exists
  useEffect(() => {
    if (!group) {
      toast.error(
        language === 'en' 
          ? 'Group not found' 
          : 'لم يتم العثور على المجموعة'
      );
      navigate('/groups');
    }
  }, [group, navigate, language]);
  
  // Find all pilgrims belonging to this group
  const groupPilgrims = pilgrims.filter(p => p.groupId === groupId);
  const hasPilgrims = groupPilgrims.length > 0;
  
  // Check if this group has any pilgrims without visa
  const pilgrimsWithoutVisa = pilgrims.filter(p => p.groupId === groupId && p.hasVisa === false);
  const hasPilgrimsWithoutVisa = pilgrimsWithoutVisa.length > 0;
  
  console.log('Group ID:', groupId);
  console.log('Group:', group);
  console.log('All pilgrims:', pilgrims);
  console.log('Group pilgrims count:', groupPilgrims.length); 
  console.log('Group pilgrims:', groupPilgrims.map(p => ({ id: p.id, name: p.nameEn, groupId: p.groupId })));
  console.log('Pilgrims without visa:', pilgrimsWithoutVisa);
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/groups')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            {language === 'en' 
              ? `Pilgrims in Group: ${group?.name || ''}` 
              : `المعتمرين في المجموعة: ${group?.name || ''}`}
          </h2>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="all">
              {language === 'en' ? 'All Pilgrims' : 'جميع المعتمرين'}
            </TabsTrigger>
            <TabsTrigger value="without-visa" disabled={!hasPilgrimsWithoutVisa}>
              {language === 'en' ? 'Without Visa' : 'بدون تأشيرة'}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            {hasPilgrims ? (
              <GroupPilgrimsList groupId={groupId} />
            ) : (
              <div className="p-8 text-center">
                <p className="text-lg mb-4">
                  {language === 'en' 
                    ? 'No pilgrims in this group yet.' 
                    : 'لا يوجد معتمرين في هذه المجموعة حتى الآن.'}
                </p>
                <Button 
                  asChild
                >
                  <Link to={`/pilgrims/new?groupId=${groupId}`}>
                    {language === 'en' ? 'Add Pilgrim' : 'إضافة معتمر'}
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="without-visa" className="mt-4">
            <GroupPilgrimsWithoutVisaList groupId={groupId} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default GroupPilgrims;
