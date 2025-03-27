import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, PenSquare, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { exportPilgrimsToExcel } from '@/utils/excelExport';

export const PilgrimList: React.FC = () => {
  const {
    pilgrims,
    groups,
    deletePilgrim,
    language
  } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  
  const filteredPilgrims = pilgrims.filter(pilgrim => 
    (pilgrim.nameEn?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (pilgrim.nameAr?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (pilgrim.passportNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    pilgrim.id.toString().includes(searchTerm)
  );
  
  const handleDelete = (id: number) => {
    deletePilgrim(id);
    toast.success(language === 'en' ? 'Pilgrim deleted successfully' : 'تم حذف المعتمر بنجاح');
  };
  
  const handleExport = () => {
    setIsExporting(true);
    exportPilgrimsToExcel(
      filteredPilgrims,
      groups,
      language,
      'pilgrims_export',
      setIsExporting
    );
  };
  
  const getGroupName = (groupId: number) => {
    const group = groups.find(g => g.id === groupId);
    return group ? group.name : '-';
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };
  
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '-';
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birthDateObj.getDate()) {
      age--;
    }
    return age;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
          <Input placeholder={language === 'en' ? 'Search pilgrims...' : 'البحث عن معتمر...'} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 rtl:pl-4 rtl:pr-9 w-full sm:w-[300px]" />
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
          <Button asChild size="sm" className="h-9">
            <Link to="/pilgrims/new">
              <Plus className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              {language === 'en' ? 'New Pilgrim' : 'معتمر جديد'}
            </Link>
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
                {language === 'en' ? 'Group' : 'المجموعة'}
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
                  {groups.find(g => g.id === pilgrim.groupId)?.name || '-'}
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
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/pilgrims/${pilgrim.id}`}>
                        <PenSquare className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(pilgrim.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
