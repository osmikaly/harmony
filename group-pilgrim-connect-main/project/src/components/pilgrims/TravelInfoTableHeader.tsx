import React from 'react';
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";

interface TravelInfoTableHeaderProps {
  language: 'en' | 'ar';
}

export const TravelInfoTableHeader: React.FC<TravelInfoTableHeaderProps> = ({ language }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead>{language === 'en' ? 'ID' : 'رقم المعتمر'}</TableHead>
          <TableHead>{language === 'en' ? 'Name' : 'الاسم'}</TableHead>
          <TableHead>{language === 'en' ? 'Group' : 'المجموعة'}</TableHead>
          <TableHead>{language === 'en' ? 'Passport' : 'جواز السفر'}</TableHead>
          <TableHead>{language === 'en' ? 'Airline' : 'شركة الطيران'}</TableHead>
          <TableHead>{language === 'en' ? 'Visa Status' : 'حالة التأشيرة'}</TableHead>
          <TableHead>{language === 'en' ? 'Room Type' : 'نوع الغرفة'}</TableHead>
        </TableRow>
      </TableHeader>
    </Table>
  );
};
