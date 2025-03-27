
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const PilgrimsWithoutVisaList: React.FC = () => {
  const { pilgrims, groups, language } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  const pilgrimsWithoutVisa = pilgrims.filter(pilgrim => !pilgrim.hasVisa);
  
  const filteredPilgrims = pilgrimsWithoutVisa.filter(pilgrim => 
    pilgrim.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pilgrim.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pilgrim.passportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pilgrim.id.toString().includes(searchTerm)
  );
  
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
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
          <Input
            placeholder={language === 'en' ? 'Search pilgrims...' : 'البحث عن حاج...'}
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
                {language === 'en' ? 'ID' : 'رقم الحاج'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                {language === 'en' ? 'Latin Name' : 'الاسم باللاتينية'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                {language === 'en' ? 'Arabic Name' : 'الاسم بالعربية'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                {language === 'en' ? 'Group' : 'المجموعة'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                {language === 'en' ? 'Profession' : 'المهنة'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                {language === 'en' ? 'Passport' : 'رقم جواز السفر'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                {language === 'en' ? 'Passport Expiry' : 'انتهاء جواز السفر'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                {language === 'en' ? 'Gender' : 'الجنس'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                {language === 'en' ? 'Birth Date' : 'تاريخ الميلاد'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                {language === 'en' ? 'Age' : 'العمر'}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                {language === 'en' ? 'Status' : 'الحالة'}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPilgrims.length > 0 ? (
              filteredPilgrims.map((pilgrim) => (
                <tr key={pilgrim.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle font-medium">{pilgrim.id}</td>
                  <td className="p-4 align-middle">{pilgrim.nameEn || '-'}</td>
                  <td className="p-4 align-middle">{pilgrim.nameAr || '-'}</td>
                  <td className="p-4 align-middle">{getGroupName(pilgrim.groupId)}</td>
                  <td className="p-4 align-middle">{pilgrim.profession || '-'}</td>
                  <td className="p-4 align-middle">{pilgrim.passportNumber || '-'}</td>
                  <td className="p-4 align-middle">{formatDate(pilgrim.passportExpiryDate)}</td>
                  <td className="p-4 align-middle">
                    {language === 'en'
                      ? pilgrim.gender === 'male' ? 'Male' : 'Female'
                      : pilgrim.gender === 'male' ? 'ذكر' : 'أنثى'}
                  </td>
                  <td className="p-4 align-middle">{formatDate(pilgrim.birthDate)}</td>
                  <td className="p-4 align-middle">{calculateAge(pilgrim.birthDate)}</td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant="outline"
                      className={`${
                        pilgrim.status === 'active'
                          ? 'bg-green-500/10 text-green-500 border-green-500/20'
                          : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}
                    >
                      {language === 'en'
                        ? pilgrim.status === 'active' ? 'Active' : 'Inactive'
                        : pilgrim.status === 'active' ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="p-4 text-center text-muted-foreground">
                  {language === 'en' 
                    ? searchTerm 
                      ? 'No pilgrims found' 
                      : 'No pilgrims without visa available'
                    : searchTerm
                      ? 'لم يتم العثور على حجاج'
                      : 'لا يوجد حجاج بدون تأشيرة'
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
