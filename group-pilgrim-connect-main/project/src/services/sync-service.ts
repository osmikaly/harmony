import { wsService } from './websocket';
import { Pilgrim, Group } from '@/context/AppContext';

class SyncService {
  private static instance: SyncService;
  private syncHandlers: Map<string, ((data: any) => void)[]> = new Map();

  private constructor() {
    this.setupWebSocketListeners();
  }

  public static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  private setupWebSocketListeners() {
    // Listen for pilgrims updates
    wsService.subscribe('pilgrims_update', (data: Pilgrim[]) => {
      this.notifyHandlers('pilgrims', data);
    });

    // Listen for groups updates
    wsService.subscribe('groups_update', (data: Group[]) => {
      this.notifyHandlers('groups', data);
    });

    // Listen for users updates
    wsService.subscribe('users_update', (data: any) => {
      this.notifyHandlers('users', data);
    });
  }

  public subscribe(type: 'pilgrims' | 'groups' | 'users', handler: (data: any) => void) {
    if (!this.syncHandlers.has(type)) {
      this.syncHandlers.set(type, []);
    }
    this.syncHandlers.get(type)?.push(handler);
  }

  public unsubscribe(type: 'pilgrims' | 'groups' | 'users', handler: (data: any) => void) {
    const handlers = this.syncHandlers.get(type) || [];
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
  }

  private notifyHandlers(type: 'pilgrims' | 'groups' | 'users', data: any) {
    const handlers = this.syncHandlers.get(type) || [];
    handlers.forEach(handler => handler(data));
  }

  public syncPilgrims(pilgrims: Pilgrim[]) {
    wsService.send('pilgrims_update', pilgrims);
  }

  public syncGroups(groups: Group[]) {
    wsService.send('groups_update', groups);
  }

  public syncUsers(users: any[]) {
    wsService.send('users_update', users);
  }
}

export const syncService = SyncService.getInstance(); 