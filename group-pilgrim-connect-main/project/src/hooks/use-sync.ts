import { useEffect } from 'react';
import { syncService } from '@/services/sync-service';
import { Pilgrim, Group } from '@/context/AppContext';

export function useSyncPilgrims(pilgrims: Pilgrim[], setPilgrims: (pilgrims: Pilgrim[]) => void) {
  useEffect(() => {
    const handleSync = (updatedPilgrims: Pilgrim[]) => {
      setPilgrims(updatedPilgrims);
    };

    syncService.subscribe('pilgrims', handleSync);

    return () => {
      syncService.unsubscribe('pilgrims', handleSync);
    };
  }, [setPilgrims]);

  useEffect(() => {
    syncService.syncPilgrims(pilgrims);
  }, [pilgrims]);
}

export function useSyncGroups(groups: Group[], setGroups: (groups: Group[]) => void) {
  useEffect(() => {
    const handleSync = (updatedGroups: Group[]) => {
      setGroups(updatedGroups);
    };

    syncService.subscribe('groups', handleSync);

    return () => {
      syncService.unsubscribe('groups', handleSync);
    };
  }, [setGroups]);

  useEffect(() => {
    syncService.syncGroups(groups);
  }, [groups]);
}

export function useSyncUsers(users: any[], setUsers: (users: any[]) => void) {
  useEffect(() => {
    const handleSync = (updatedUsers: any[]) => {
      setUsers(updatedUsers);
    };

    syncService.subscribe('users', handleSync);

    return () => {
      syncService.unsubscribe('users', handleSync);
    };
  }, [setUsers]);

  useEffect(() => {
    syncService.syncUsers(users);
  }, [users]);
} 