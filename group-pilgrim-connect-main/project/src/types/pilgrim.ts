import { Pilgrim } from '@/context/AppContext';

// Define enhanced pilgrim type with additional properties
export type EnhancedPilgrim = Pilgrim & {
  groupName: string;
  roomTypeFormatted: string;
  visaDetails?: string;
  airlineDetails?: string;
  hasTransport?: boolean;
  transportType?: string;
  transportDetails?: string;
  hotelName?: string;
  hotelDetails?: string;
  roomDetails?: string;
  referredByDetails?: string;
  agentDetails?: string;
};
