import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search, Users, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

export const GroupsWithoutVisaList: React.FC = () => {
  const { pilgrims, groups, language } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGroups, setFilteredGroups] = useState<typeof groups>([]);
  
  useEffect(() => {
    // Log all pilgrims to see their hasVisa status
    console.log('All pilgrims:', pilgrims);
    console.log('All pilgrims hasVisa status:', pilgrims.map(p => ({ id: p.id, hasVisa: p.hasVisa, name: p.nameEn })));
    
    // Filter groups that have at least one pilgrim with hasVisa === false
    const groupsWithoutVisa = groups.filter(group => {
      const groupPilgrims = pilgrims.filter(p => p.groupId === group.id);
      // Explicitly check for false, not falsy values
      return groupPilgrims.some(p => p.hasVisa === false);
    });
    
    console.log('Groups without visa:', groupsWithoutVisa);
    
    // Then apply the search filter
    const searched = groupsWithoutVisa.filter(group => 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.id.toString().includes(searchTerm)
    );
    
    setFilteredGroups(searched);
  }, [groups, pilgrims, searchTerm]);
  
  // Count pilgrims without visa in each group
  const countPilgrimsWithoutVisa = (groupId: number) => {
    return pilgrims.filter(p => p.groupId === groupId && p.hasVisa === false).length;
  };
  
  // Export groups without visa to Excel
  const exportToExcel = () => {
    try {
      const dataToExport = filteredGroups.map(group => ({
        ID: group.id,
        'Group Name': group.name,
        'City': group.city,
        'Pilgrims Without Visa': countPilgrimsWithoutVisa(group.id)
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Groups Without Visa");
      
      // Generate file name with date
      const date = new Date();
      const fileName = `groups_without_visa_${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.xlsx`;
      
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
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
        <div className="flex gap-2 justify-end w-full sm:w-auto">
          <Button onClick={exportToExcel} variant="outline" size="sm" className="h-9">
            <Download className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
            {language === 'en' ? 'Export' : 'تصدير'}
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
                {language === 'en' ? 'Group Name' : 'اسم المجموعة'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                {language === 'en' ? 'City' : 'المدينة'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                {language === 'en' ? 'Pilgrims Without Visa' : 'معتمرين بدون تأشيرة'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                {language === 'en' ? 'Actions' : 'الإجراءات'}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => {
                const pilgrimsWithoutVisaCount = countPilgrimsWithoutVisa(group.id);
                
                return (
                  <tr key={group.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">{group.id}</td>
                    <td className="p-4 align-middle">{group.name}</td>
                    <td className="p-4 align-middle">{group.city}</td>
                    <td className="p-4 align-middle">{pilgrimsWithoutVisaCount}</td>
                    <td className="p-4 align-middle">
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                          <Link to={`/pilgrims-without-visa/${group.id}`}>
                            <Users className="h-4 w-4" />
                            <span className="sr-only">View Pilgrims</span>
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                  {language === 'en' 
                    ? searchTerm 
                      ? 'No groups found' 
                      : 'No groups with pilgrims without visa available'
                    : searchTerm
                      ? 'لم يتم العثور على مجموعات'
                      : 'لا يوجد مجموعات بمعتمرين بدون تأشيرة'
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
