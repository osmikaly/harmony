import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Search, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { exportPilgrimsToExcel } from '@/utils/excelExport';

export const TravelInfoList: React.FC = () => {
  const { pilgrims, groups, language } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPilgrims, setFilteredPilgrims] = useState<typeof pilgrims>([]);
  const [isProcessing, setIsProcessing] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  
  // Memoize pilgrims with travel information to avoid recalculation
  const pilgrimsWithTravel = useMemo(() => {
    console.log('Filtering pilgrims with travel information');
    return pilgrims.filter(pilgrim => 
      pilgrim?.airline && pilgrim.airline.trim() !== ''
    );
  }, [pilgrims]);
  
  // Apply search filter in a separate effect for better performance
  useEffect(() => {
    console.log('Applying search filter');
    setIsProcessing(true);
    
    // Use setTimeout to avoid blocking the main thread
    const timer = setTimeout(() => {
      try {
        // Apply search filter - safely handle undefined values
        const searched = pilgrimsWithTravel.filter(pilgrim => 
          (pilgrim?.nameEn?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (pilgrim?.nameAr?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (pilgrim?.passportNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (pilgrim?.airline?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          pilgrim?.id?.toString().includes(searchTerm)
        );
        
        setFilteredPilgrims(searched);
      } catch (error) {
        console.error('Error filtering pilgrims in TravelInfoList:', error);
        setFilteredPilgrims([]);
      } finally {
        setIsProcessing(false);
      }
    }, 100); // Small delay to prevent UI freezing
    
    return () => clearTimeout(timer);
  }, [pilgrimsWithTravel, searchTerm]);
  
  const handleExport = () => {
    setIsExporting(true);
    exportPilgrimsToExcel(
      filteredPilgrims,
      groups,
      language,
      'travel_information',
      setIsExporting
    );
  };
  
  // Rendering content with loading state
  const renderContent = () => {
    if (isProcessing) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      );
    }
    
    return (
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
                {language === 'en' ? 'Airline' : 'شركة الطيران'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 rtl:text-right">
                {language === 'en' ? 'Status' : 'الحالة'}
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
                  {pilgrim.airline || '-'}
                </td>
                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                  <Badge variant={pilgrim.status === 'active' ? 'default' : 'secondary'}>
                    {language === 'en' 
                      ? pilgrim.status === 'active' ? 'Active' : 'Inactive'
                      : pilgrim.status === 'active' ? 'نشط' : 'غير نشط'
                    }
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
          <Input
            placeholder={language === 'en' ? 'Search travel info...' : 'البحث في معلومات السفر...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 rtl:pl-4 rtl:pr-9 w-full sm:w-[300px]"
            disabled={isProcessing}
          />
        </div>
        <div className="flex gap-2 justify-end w-full sm:w-auto">
          <Button 
            onClick={handleExport} 
            variant="outline" 
            size="sm" 
            className="h-9"
            disabled={isExporting || isProcessing || filteredPilgrims.length === 0}
          >
            <Download className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
            {isExporting 
              ? (language === 'en' ? 'Exporting...' : 'جاري التصدير...') 
              : (language === 'en' ? 'Export' : 'تصدير')}
          </Button>
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default TravelInfoList;
