import * as XLSX from 'xlsx';
import type { Pilgrim, Group } from '@/context/AppContext';

// Helper function to format date strings
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

// Helper function to get group name by ID
const getGroupNameById = (groupId: number, groups: Group[]) => {
  const group = groups.find(g => g.id === groupId);
  return group ? group.name : '-';
};

// Helper function to translate payment method
const translatePaymentMethod = (method: string, language: 'en' | 'ar') => {
  const translations: Record<string, Record<string, string>> = {
    cash: {
      en: 'Cash',
      ar: 'نقدي'
    },
    bank_transfer: {
      en: 'Bank Transfer',
      ar: 'تحويل بنكي'
    },
    bank_check: {
      en: 'Bank Check',
      ar: 'شيك بنكي'
    }
  };
  return translations[method]?.[language] || method;
};

export const exportPilgrimsToExcel = (
  pilgrims: Pilgrim[],
  groups: Group[],
  language: 'en' | 'ar',
  filename: string,
  setExporting: (isExporting: boolean) => void
) => {
  try {
    // Process pilgrim data
    const processedData = pilgrims.map((pilgrim, index) => {
      return {
        // ID and basic info
        [language === 'en' ? 'ID' : 'الرقم']: pilgrim.id,
        [language === 'en' ? 'Group' : 'المجموعة']: getGroupNameById(pilgrim.groupId, groups),
        [language === 'en' ? 'Name (English)' : 'الاسم (بالانجليزية)']: pilgrim.nameEn || '-',
        [language === 'en' ? 'Name (Arabic)' : 'الاسم (بالعربية)']: pilgrim.nameAr || '-',
        [language === 'en' ? 'Gender' : 'الجنس']: language === 'en' 
          ? (pilgrim.gender === 'male' ? 'Male' : 'Female')
          : (pilgrim.gender === 'male' ? 'ذكر' : 'أنثى'),
        [language === 'en' ? 'Status' : 'الحالة']: language === 'en'
          ? (pilgrim.status === 'active' ? 'Active' : 'Inactive')
          : (pilgrim.status === 'active' ? 'نشط' : 'غير نشط'),
        [language === 'en' ? 'Phone Number' : 'رقم الهاتف']: pilgrim.phoneNumber || '-',
        [language === 'en' ? 'Email' : 'البريد الإلكتروني']: pilgrim.email || '-',
        [language === 'en' ? 'Profession' : 'المهنة']: pilgrim.profession || '-',
        
        // Birth Information
        [language === 'en' ? 'Birth Date' : 'تاريخ الميلاد']: formatDate(pilgrim.birthDate),
        [language === 'en' ? 'Birth City' : 'مدينة الميلاد']: pilgrim.birthCity || '-',
        [language === 'en' ? 'Birth Country' : 'دولة الميلاد']: pilgrim.birthCountry || '-',
        
        // Passport Information
        [language === 'en' ? 'Passport Number' : 'رقم الجواز']: pilgrim.passportNumber || '-',
        [language === 'en' ? 'Passport Type' : 'نوع الجواز']: pilgrim.passportType || '-',
        [language === 'en' ? 'Passport Issue Date' : 'تاريخ إصدار الجواز']: formatDate(pilgrim.passportIssueDate),
        [language === 'en' ? 'Passport Expiry Date' : 'تاريخ انتهاء الجواز']: formatDate(pilgrim.passportExpiryDate),
        [language === 'en' ? 'Passport Issue City' : 'مدينة إصدار الجواز']: pilgrim.passportIssueCity || '-',
        [language === 'en' ? 'Passport Issue Country' : 'دولة إصدار الجواز']: pilgrim.passportIssueCountry || '-',
        
        // Visa Information
        [language === 'en' ? 'Has Visa' : 'لديه تأشيرة']: language === 'en'
          ? (pilgrim.hasVisa ? 'Yes' : 'No')
          : (pilgrim.hasVisa ? 'نعم' : 'لا'),
        [language === 'en' ? 'Visa Type' : 'نوع التأشيرة']: pilgrim.visaType || '-',
        
        // Travel Information
        [language === 'en' ? 'Airline' : 'شركة الطيران']: pilgrim.airline || '-',
        [language === 'en' ? 'Airline Details' : 'تفاصيل شركة الطيران']: pilgrim.airlineDetails || '-',
        [language === 'en' ? 'Has Transport' : 'لديه مواصلات']: language === 'en'
          ? (pilgrim.hasTransport ? 'Yes' : 'No')
          : (pilgrim.hasTransport ? 'نعم' : 'لا'),
        [language === 'en' ? 'Transport Type' : 'نوع المواصلات']: pilgrim.transportType || '-',
        [language === 'en' ? 'Referred By' : 'من طرف']: pilgrim.referredBy || '-',
        [language === 'en' ? 'Agent' : 'الوكيل']: pilgrim.agent || '-',
        
        // Accommodation Information
        [language === 'en' ? 'Room Type' : 'نوع الغرفة']: pilgrim.roomType || '-',
        [language === 'en' ? 'Hotel Name' : 'اسم الفندق']: pilgrim.hotelName || '-',
        [language === 'en' ? 'Receipt Number' : 'رقم الإيصال']: pilgrim.receiptNumber || '-',
        
        // Financial Information
        [language === 'en' ? 'Advance Payment' : 'الدفع المقدم']: pilgrim.advancePayment || '-',
        [language === 'en' ? 'Advance Payment Method' : 'طريقة الدفع المقدم']: translatePaymentMethod(pilgrim.advancePaymentMethod || 'cash', language),
      };
    });

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(processedData);

    // Set column widths
    const columnWidths = [
      { wch: 5 },  // ID
      { wch: 20 }, // Group
      { wch: 25 }, // Name (English)
      { wch: 25 }, // Name (Arabic)
      { wch: 10 }, // Gender
      { wch: 10 }, // Status
      { wch: 15 }, // Phone Number
      { wch: 25 }, // Email
      { wch: 20 }, // Profession
      { wch: 12 }, // Birth Date
      { wch: 15 }, // Birth City
      { wch: 15 }, // Birth Country
      { wch: 15 }, // Passport Number
      { wch: 15 }, // Passport Type
      { wch: 15 }, // Passport Issue Date
      { wch: 15 }, // Passport Expiry Date
      { wch: 15 }, // Passport Issue City
      { wch: 15 }, // Passport Issue Country
      { wch: 10 }, // Has Visa
      { wch: 15 }, // Visa Type
      { wch: 15 }, // Airline
      { wch: 20 }, // Airline Details
      { wch: 12 }, // Has Transport
      { wch: 15 }, // Transport Type
      { wch: 15 }, // Referred By
      { wch: 15 }, // Agent
      { wch: 12 }, // Room Type
      { wch: 20 }, // Hotel Name
      { wch: 15 }, // Receipt Number
      { wch: 15 }, // Advance Payment
      { wch: 20 }, // Advance Payment Method
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(
      workbook, 
      worksheet, 
      language === 'en' ? "Pilgrim Information" : "معلومات المعتمرين"
    );

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fullFilename = `${filename}_${timestamp}.xlsx`;

    // Write file
    XLSX.writeFile(workbook, fullFilename);

    setExporting(false);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    setExporting(false);
    throw error;
  }
};
