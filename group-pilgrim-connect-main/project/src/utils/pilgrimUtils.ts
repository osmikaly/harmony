
import { Pilgrim, Group } from '@/context/AppContext';
import { EnhancedPilgrim } from '@/types/pilgrim';

// Get filtered pilgrims with travel information
export const getFilteredPilgrims = (
  pilgrims: Pilgrim[],
  searchTerm: string,
  enhancedPilgrims: EnhancedPilgrim[]
): EnhancedPilgrim[] => {
  if (!searchTerm.trim()) {
    return enhancedPilgrims;
  }
  
  const searchTermLower = searchTerm.toLowerCase();
  
  // Apply search filter
  return enhancedPilgrims.filter(pilgrim => 
    (pilgrim?.nameEn?.toLowerCase() || '').includes(searchTermLower) ||
    (pilgrim?.nameAr?.toLowerCase() || '').includes(searchTermLower) ||
    (pilgrim?.passportNumber?.toLowerCase() || '').includes(searchTermLower) ||
    (pilgrim?.airline?.toLowerCase() || '').includes(searchTermLower) ||
    (pilgrim?.groupName?.toLowerCase() || '').includes(searchTermLower) ||
    pilgrim?.id?.toString().includes(searchTermLower)
  );
};

// Get pilgrims with travel information
export const getPilgrimsWithTravel = (pilgrims: Pilgrim[]): Pilgrim[] => {
  return pilgrims.filter(pilgrim => 
    pilgrim?.airline && pilgrim.airline.trim() !== ''
  );
};

// Get group name by ID
export const getGroupName = (
  groupId: number, 
  groups: Group[], 
  language: 'en' | 'ar'
): string => {
  if (!groupId) return language === 'en' ? 'No Group' : 'بدون مجموعة';
  const group = groups.find(g => g.id === groupId);
  return group ? group.name : (language === 'en' ? 'Unknown Group' : 'مجموعة غير معروفة');
};

// Format room type
export const formatRoomType = (
  roomType: string, 
  language: 'en' | 'ar'
): string => {
  return roomType === 'single' ? (language === 'en' ? 'Single' : 'فردية') :
    roomType === 'double' ? (language === 'en' ? 'Double' : 'مزدوجة') :
    roomType === 'triple' ? (language === 'en' ? 'Triple' : 'ثلاثية') :
    (language === 'en' ? 'Quad' : 'رباعي');
};

// Process pilgrims data with proper formatting
export const enhancePilgrims = (
  pilgrimsWithTravel: Pilgrim[],
  getGroupNameFn: (groupId: number) => string,
  formatRoomTypeFn: (roomType: string) => string
): EnhancedPilgrim[] => {
  return pilgrimsWithTravel.map(pilgrim => ({
    ...pilgrim,
    groupName: getGroupNameFn(pilgrim.groupId),
    roomTypeFormatted: formatRoomTypeFn(pilgrim.roomType || 'single')
  }));
};
