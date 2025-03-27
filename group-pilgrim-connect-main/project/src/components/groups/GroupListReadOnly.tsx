
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const GroupListReadOnly: React.FC = () => {
  const { groups, pilgrims, language } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.id.toString().includes(searchTerm)
  );
  
  const handleRowClick = (groupId: number) => {
    navigate(`/group-pilgrims-readonly/${groupId}`);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
          <Input
            placeholder={language === 'en' ? 'Search groups...' : 'البحث عن مجموعة...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 rtl:pl-4 rtl:pr-9 w-full sm:w-[300px]"
          />
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
                {language === 'en' ? 'Pilgrims' : 'عدد الحجاج'}
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
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <tr 
                  key={group.id} 
                  className="border-b transition-colors hover:bg-muted/50 cursor-pointer" 
                  onClick={() => handleRowClick(group.id)}
                >
                  <td className="p-4 align-middle font-medium">{group.id}</td>
                  <td className="p-4 align-middle">{group.name}</td>
                  <td className="p-4 align-middle">{group.city}</td>
                  <td className="p-4 align-middle">
                    {pilgrims.filter((p) => p.groupId === group.id).length}
                  </td>
                  <td className="p-4 align-middle max-w-[200px] truncate">{group.notes || '-'}</td>
                  <td className="p-4 align-middle">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(group.id);
                        }}
                      >
                        <Users className="h-4 w-4" />
                        <span className="sr-only">View Pilgrims</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-muted-foreground">
                  {language === 'en' 
                    ? searchTerm 
                      ? 'No groups found' 
                      : 'No groups available'
                    : searchTerm
                      ? 'لم يتم العثور على مجموعات'
                      : 'لا توجد مجموعات متاحة'
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
