import React, { createContext, useContext, useState, useEffect } from 'react';

export type Pilgrim = {
  id: number;
  groupId: number;
  nameAr: string;
  nameEn: string;
  gender: 'male' | 'female';
  birthDate: string;
  birthCity: string;
  birthCountry: string;
  profession: string;
  status: 'active' | 'inactive';
  phoneNumber: string;
  email: string;
  passportNumber: string;
  passportType: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  passportIssueCity: string;
  passportIssueCountry: string;
  hasVisa: boolean;
  visaType: string;
  roomType: string;
  advancePayment: string;
  advancePaymentMethod: 'cash' | 'bank_transfer' | 'bank_check';
  receiptNumber: string;
  airline: string;
  airlineDetails: string;
  hasTransport: boolean;
  transportType: string;
  referredBy: string;
  agent: string;
  hotelName: string;
  photo?: string;
  visaScan?: string;
};

export type Group = {
  id: number;
  name: string;
  city: string;
  notes: string;
  pilgrims: number[];
};

type AppContextType = {
  pilgrims: Pilgrim[];
  groups: Group[];
  addPilgrim: (pilgrim: Omit<Pilgrim, 'id'>) => void;
  updatePilgrim: (id: number, pilgrim: Partial<Pilgrim>) => void;
  deletePilgrim: (id: number) => void;
  addGroup: (group: Omit<Group, 'id' | 'pilgrims'>) => void;
  updateGroup: (id: number, group: Partial<Group>) => void;
  deleteGroup: (id: number) => void;
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pilgrims, setPilgrims] = useState<Pilgrim[]>(() => {
    const saved = localStorage.getItem('pilgrims');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('groups');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [language, setLanguage] = useState<'en' | 'ar'>(() => {
    const saved = localStorage.getItem('language');
    return (saved as 'en' | 'ar') || 'en';
  });
  
  useEffect(() => {
    localStorage.setItem('pilgrims', JSON.stringify(pilgrims));
  }, [pilgrims]);
  
  useEffect(() => {
    localStorage.setItem('groups', JSON.stringify(groups));
  }, [groups]);
  
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);
  
  const addPilgrim = (pilgrim: Omit<Pilgrim, 'id'>) => {
    // Generate a new ID for the pilgrim
    const newPilgrimId = pilgrims.length > 0 ? Math.max(...pilgrims.map(p => p.id)) + 1 : 1;
    
    // Create the new pilgrim with the generated ID
    const newPilgrim = {
      ...pilgrim,
      id: newPilgrimId,
      // Ensure groupId is a number
      groupId: Number(pilgrim.groupId)
    };
    
    // Add the pilgrim to the pilgrims array
    setPilgrims(prevPilgrims => [...prevPilgrims, newPilgrim]);
    
    // If the pilgrim is associated with a group, update that group's pilgrims array
    if (newPilgrim.groupId > 0) {
      setGroups(prevGroups => {
        return prevGroups.map(group => {
          if (group.id === newPilgrim.groupId) {
            // Add pilgrim's ID to the group's pilgrims array
            return {
              ...group,
              pilgrims: [...group.pilgrims, newPilgrimId]
            };
          }
          return group;
        });
      });
      
      console.log(`Added pilgrim ID ${newPilgrimId} to group ${newPilgrim.groupId}`);
    }
  };
  
  const updatePilgrim = (id: number, updatedFields: Partial<Pilgrim>) => {
    // First, find the existing pilgrim to get its current groupId
    const pilgrimIndex = pilgrims.findIndex(p => p.id === id);
    if (pilgrimIndex === -1) return;
    
    const currentPilgrim = pilgrims[pilgrimIndex];
    const oldGroupId = currentPilgrim.groupId;
    
    // Create the updated pilgrim
    const updatedPilgrim = { 
      ...currentPilgrim, 
      ...updatedFields,
      // Ensure groupId is a number if it's being updated
      groupId: updatedFields.groupId !== undefined ? Number(updatedFields.groupId) : currentPilgrim.groupId
    };
    
    // Update the pilgrims array
    setPilgrims(prevPilgrims => {
      const newPilgrims = [...prevPilgrims];
      newPilgrims[pilgrimIndex] = updatedPilgrim;
      return newPilgrims;
    });
    
    // If the group has changed, update both groups
    if (updatedFields.groupId !== undefined && Number(updatedFields.groupId) !== oldGroupId) {
      const newGroupId = Number(updatedFields.groupId);
      
      setGroups(prevGroups => {
        return prevGroups.map(group => {
          // Remove from old group
          if (group.id === oldGroupId) {
            return {
              ...group,
              pilgrims: group.pilgrims.filter(pilgrimId => pilgrimId !== id)
            };
          }
          // Add to new group
          else if (group.id === newGroupId) {
            // Only add if not already in the array
            if (!group.pilgrims.includes(id)) {
              return {
                ...group,
                pilgrims: [...group.pilgrims, id]
              };
            }
          }
          return group;
        });
      });
      
      console.log(`Moved pilgrim ID ${id} from group ${oldGroupId} to group ${newGroupId}`);
    }
  };
  
  const deletePilgrim = (id: number) => {
    // Find the pilgrim to get its groupId
    const pilgrim = pilgrims.find(p => p.id === id);
    if (!pilgrim) return;
    
    const groupId = pilgrim.groupId;
    
    // Remove the pilgrim
    setPilgrims(prevPilgrims => prevPilgrims.filter(p => p.id !== id));
    
    // If the pilgrim was in a group, update that group
    if (groupId) {
      setGroups(prevGroups => {
        return prevGroups.map(group => {
          if (group.id === groupId) {
            return {
              ...group,
              pilgrims: group.pilgrims.filter(pilgrimId => pilgrimId !== id)
            };
          }
          return group;
        });
      });
      
      console.log(`Removed pilgrim ID ${id} from group ${groupId}`);
    }
  };
  
  const addGroup = (group: Omit<Group, 'id' | 'pilgrims'>) => {
    // Generate a new ID for the group
    const newGroupId = groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1;
    
    // Create the new group with generated ID and empty pilgrims array
    const newGroup = {
      ...group,
      id: newGroupId,
      pilgrims: []
    };
    
    // Add the group
    setGroups(prevGroups => [...prevGroups, newGroup]);
    
    console.log(`Created new group with ID ${newGroupId}`);
  };
  
  const updateGroup = (id: number, updateData: Partial<Group>) => {
    // Update the group
    setGroups(prevGroups => {
      return prevGroups.map(group => {
        if (group.id === id) {
          return {
            ...group,
            ...updateData,
            // Make sure we don't overwrite the pilgrims array unless explicitly provided
            pilgrims: updateData.pilgrims !== undefined ? updateData.pilgrims : group.pilgrims
          };
        }
        return group;
      });
    });
    
    console.log(`Updated group with ID ${id}`);
  };
  
  const deleteGroup = (id: number) => {
    // First update all pilgrims that belong to this group
    setPilgrims(prevPilgrims => {
      return prevPilgrims.map(pilgrim => {
        if (pilgrim.groupId === id) {
          // Set groupId to 0 (no group)
          return { ...pilgrim, groupId: 0 };
        }
        return pilgrim;
      });
    });
    
    // Then delete the group
    setGroups(prevGroups => prevGroups.filter(group => group.id !== id));
    
    console.log(`Deleted group with ID ${id} and removed group reference from its pilgrims`);
  };
  
  return (
    <AppContext.Provider
      value={{
        pilgrims,
        groups,
        addPilgrim,
        updatePilgrim,
        deletePilgrim,
        addGroup,
        updateGroup,
        deleteGroup,
        language,
        setLanguage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
