import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Search, Download, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { exportPilgrimsToExcel } from '@/utils/excelExport';
import { useNavigate } from 'react-router-dom';

interface GroupPilgrimsWithoutVisaListProps {
  groupId: number;
}

export const GroupPilgrimsWithoutVisaList: React.FC<GroupPilgrimsWithoutVisaListProps> = ({ groupId }) => {
  const { pilgrims, groups, language } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPilgrims, setFilteredPilgrims] = useState<typeof pilgrims>([]);
  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    try {
      // Get pilgrims without visa for this group (explicitly check for hasVisa === false)
      const groupPilgrimsWithoutVisa = pilgrims.filter(
        pilgrim => pilgrim.groupId === groupId && pilgrim.hasVisa === false
      );
      
      console.log('Group pilgrims without visa for group', groupId, ':', groupPilgrimsWithoutVisa);
      
      // Apply search filter
      const searched = groupPilgrimsWithoutVisa.filter(pilgrim => 
        (pilgrim.nameEn?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (pilgrim.nameAr?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (pilgrim.passportNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        pilgrim.id.toString().includes(searchTerm)
      );
      
      setFilteredPilgrims(searched);
    } catch (error) {
      console.error('Error filtering pilgrims in GroupPilgrimsWithoutVisaList:', error);
      setFilteredPilgrims([]);
    }
  }, [pilgrims, groupId, searchTerm]);
  
  const handleExport = () => {
    setIsExporting(true);
    exportPilgrimsToExcel(
      filteredPilgrims,
      groups,
      language,
      `pilgrims_without_visa_group_${groupId}`,
      setIsExporting
    );
  };

  const handleEdit = (pilgrimId: number) => {
    navigate(`/pilgrims/${pilgrimId}`);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
          <Input
            placeholder={language === 'en' ? 'Search pilgrims...' : 'البحث عن معتمر...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 rtl:pl-4 rtl:pr-9 w-full sm:w-[300px]"
          />
        </div>
        <div className="flex gap-2 justify-end w-full sm:w-auto">
          <Button 
            onClick={handleExport} 
            variant="outline" 
            size="sm" 
            className="h-9"
            disabled={isExporting || filteredPilgrims.length === 0}
          >
            <Download className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
            {isExporting 
              ? (language === 'en' ? 'Exporting...' : 'جاري التصدير...') 
              : (language === 'en' ? 'Export' : 'تصدير')}
          </Button>
        </div>
      </div>
      
      <div className="overflow-auto rounded-md border glass-card">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 rtl:text-right">
                {language === 'en' ? 'ID' : 'الرقم'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 rtl:text-right">
                {language === 'en' ? 'Name' : 'الاسم'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 rtl:text-right">
                {language === 'en' ? 'Status' : 'الحالة'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 rtl:text-right">
                {language === 'en' ? 'Actions' : 'الإجراءات'}
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {filteredPilgrims.map((pilgrim) => (
              <tr key={pilgrim.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{pilgrim.id}</td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <div className="flex flex-col">
                    <span className="font-medium">{pilgrim.nameEn}</span>
                    <span className="text-sm text-muted-foreground">{pilgrim.nameAr}</span>
                  </div>
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <Badge variant={pilgrim.status === 'active' ? 'default' : 'secondary'}>
                    {language === 'en' 
                      ? pilgrim.status === 'active' ? 'Active' : 'Inactive'
                      : pilgrim.status === 'active' ? 'نشط' : 'غير نشط'
                    }
                  </Badge>
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(pilgrim.id)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
