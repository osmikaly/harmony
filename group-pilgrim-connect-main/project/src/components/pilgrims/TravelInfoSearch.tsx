
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TravelInfoSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  exportToExcel: () => void;
  isExporting: boolean;
  isLoading: boolean;
  hasData: boolean;
  language: 'en' | 'ar';
}

export const TravelInfoSearch: React.FC<TravelInfoSearchProps> = ({
  searchTerm,
  setSearchTerm,
  exportToExcel,
  isExporting,
  isLoading,
  hasData,
  language
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
        <Input
          placeholder={language === 'en' ? 'Search travel info...' : 'البحث في معلومات السفر...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 rtl:pl-4 rtl:pr-9 w-full sm:w-[300px]"
          disabled={isLoading}
        />
      </div>
      <div className="flex gap-2 justify-end w-full sm:w-auto">
        <Button 
          onClick={exportToExcel} 
          variant="outline" 
          size="sm" 
          className="h-9"
          disabled={isExporting || !hasData}
        >
          {isExporting ? (
            <RefreshCw className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
          )}
          {language === 'en' ? 'Export' : 'تصدير'}
        </Button>
      </div>
    </div>
  );
};
