import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, PenSquare, Plus, Search, Trash2, Upload, Users } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const GroupList: React.FC = () => {
  const {
    groups,
    pilgrims,
    deleteGroup,
    language
  } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [showPilgrimsDialog, setShowPilgrimsDialog] = useState(false);
  
  const filteredGroups = groups.filter(group => group.name.toLowerCase().includes(searchTerm.toLowerCase()) || group.city.toLowerCase().includes(searchTerm.toLowerCase()) || group.id.toString().includes(searchTerm));
  
  const handleDelete = (id: number) => {
    deleteGroup(id);
    toast.success(language === 'en' ? 'Group deleted successfully' : 'تم حذف المجموعة بنجاح');
  };
  
  const handleRowClick = (groupId: number) => {
    navigate(`/group-pilgrims/${groupId}`);
  };

  const handleShowGroupPilgrims = (e: React.MouseEvent, groupId: number) => {
    e.stopPropagation();
    setSelectedGroupId(groupId);
    setShowPilgrimsDialog(true);
  };

  const groupPilgrims = selectedGroupId 
    ? pilgrims.filter(p => p.groupId === selectedGroupId) 
    : [];

  return <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
          <Input placeholder={language === 'en' ? 'Search groups...' : 'البحث عن مجموعة...'} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 rtl:pl-4 rtl:pr-9 w-full sm:w-[300px]" />
        </div>
        <div className="flex gap-2 justify-end w-full sm:w-auto">
          <Button asChild variant="outline" size="sm" className="h-9">
            <Link to="/pilgrims-without-visa">
              <Upload className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              {language === 'en' ? 'Groups Without Visa' : 'مجموعات بدون تأشيرة'}
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
            {language === 'en' ? 'Export' : 'تصدير'}
          </Button>
          <Button asChild size="sm" className="h-9">
            <Link to="/groups/new">
              <Plus className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              {language === 'en' ? 'New Group' : 'مجموعة جديدة'}
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="overflow-auto rounded-md border glass-card">
        <table className="w-full caption-bottom text-sm">
          <thead className="border-b">
            <tr className="bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium">
                {language === 'en' ? 'ID' : 'رقم المجموعة'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                {language === 'en' ? 'Name' : 'اسم المجموعة'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                {language === 'en' ? 'City' : 'المدينة'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                {language === 'en' ? 'Pilgrims' : 'عدد المعتمرين'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                {language === 'en' ? 'Notes' : 'ملاحظات'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                {language === 'en' ? 'Actions' : 'الإجراءات'}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.length > 0 ? filteredGroups.map(group => <tr key={group.id} className="border-b transition-colors hover:bg-muted/50 cursor-pointer" onClick={() => handleRowClick(group.id)}>
                  <td className="p-4 align-middle font-medium">{group.id}</td>
                  <td className="p-4 align-middle">{group.name}</td>
                  <td className="p-4 align-middle">{group.city}</td>
                  <td className="p-4 align-middle">
                    {pilgrims.filter(p => p.groupId === group.id).length}
                  </td>
                  <td className="p-4 align-middle max-w-[200px] truncate">{group.notes || '-'}</td>
                  <td className="p-4 align-middle">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link to={`/groups/${group.id}`} onClick={e => e.stopPropagation()}>
                          <PenSquare className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={e => {
                  e.stopPropagation();
                  handleDelete(group.id);
                }}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={e => {
                  e.stopPropagation();
                  handleRowClick(group.id);
                }}>
                        <Users className="h-4 w-4" />
                        <span className="sr-only">View Pilgrims</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={e => handleShowGroupPilgrims(e, group.id)}>
                        <Upload className="h-4 w-4" />
                        <span className="sr-only">Show Pilgrims</span>
                      </Button>
                    </div>
                  </td>
                </tr>) : <tr>
                <td colSpan={6} className="p-4 text-center text-muted-foreground">
                  {language === 'en' ? searchTerm ? 'No groups found' : 'No groups available' : searchTerm ? 'لم يتم العثور على مجموعات' : 'لا توجد مجموعات متاحة'}
                </td>
              </tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={showPilgrimsDialog} onOpenChange={setShowPilgrimsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {language === 'en' 
                ? `Pilgrims in Group: ${selectedGroupId ? groups.find(g => g.id === selectedGroupId)?.name : ''}` 
                : `المعتمرين في المجموعة: ${selectedGroupId ? groups.find(g => g.id === selectedGroupId)?.name : ''}`}
            </DialogTitle>
            <DialogDescription>
              {language === 'en' 
                ? 'List of all pilgrims attached to this group' 
                : 'قائمة بجميع المعتمرين المرتبطين بهذه المجموعة'}
            </DialogDescription>
          </DialogHeader>
          
          {groupPilgrims.length > 0 ? (
            <div className="overflow-auto rounded-md border">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b">
                  <tr className="bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      {language === 'en' ? 'ID' : 'رقم المعتمر'}
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      {language === 'en' ? 'Latin Name' : 'الاسم باللاتينية'}
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      {language === 'en' ? 'Arabic Name' : 'الاسم بالعربية'}
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      {language === 'en' ? 'Passport' : 'رقم جواز السفر'}
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      {language === 'en' ? 'Has Visa' : 'لديه تأشيرة'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groupPilgrims.map((pilgrim) => (
                    <tr key={pilgrim.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">{pilgrim.id}</td>
                      <td className="p-4 align-middle">{pilgrim.nameEn || '-'}</td>
                      <td className="p-4 align-middle">{pilgrim.nameAr || '-'}</td>
                      <td className="p-4 align-middle">{pilgrim.passportNumber || '-'}</td>
                      <td className="p-4 align-middle">
                        {language === 'en'
                          ? pilgrim.hasVisa === true ? 'Yes' : 'No'
                          : pilgrim.hasVisa === true ? 'نعم' : 'لا'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              {language === 'en' 
                ? 'No pilgrims available in this group' 
                : 'لا يوجد معتمرين في هذه المجموعة'}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>;
};
