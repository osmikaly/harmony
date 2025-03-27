
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { EnhancedPilgrim } from '@/types/pilgrim';

interface TravelInfoTableRowProps {
  pilgrim: EnhancedPilgrim;
  language: 'en' | 'ar';
  style: React.CSSProperties;
}

export const TravelInfoTableRow: React.FC<TravelInfoTableRowProps> = ({ 
  pilgrim, 
  language, 
  style 
}) => {
  return (
    <TableRow
      className="absolute top-0 left-0 border-b w-full"
      style={style}
    >
      <TableCell className="font-medium">{pilgrim.id}</TableCell>
      <TableCell>
        {language === 'en' ? pilgrim.nameEn || '-' : pilgrim.nameAr || '-'}
      </TableCell>
      <TableCell>{pilgrim.groupName}</TableCell>
      <TableCell>{pilgrim.passportNumber || '-'}</TableCell>
      <TableCell>{pilgrim.airline || '-'}</TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={`${
            pilgrim.hasVisa === true
              ? 'bg-green-500/10 text-green-500 border-green-500/20'
              : 'bg-red-500/10 text-red-500 border-red-500/20'
          }`}
        >
          {pilgrim.hasVisa === true 
            ? (language === 'en' ? 'Has Visa' : 'لديه تأشيرة')
            : (language === 'en' ? 'No Visa' : 'بدون تأشيرة')}
        </Badge>
      </TableCell>
      <TableCell>{pilgrim.roomTypeFormatted}</TableCell>
    </TableRow>
  );
};
