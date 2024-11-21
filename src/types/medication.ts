export interface Medication {
  id: string;
  name: string;
  dosage?: string;
  frequency?: string;
  prescriber?: string;
  startDate?: string;
  instructions?: string;
  lastRefillDate?: string;
  nextRefillDate?: string;
  nextDose?: string;
  isAsNeeded: boolean;
  group?: 'morning' | 'midday' | 'evening' | 'night';
  icon?: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  timestamp: string;
  loggedAt: string;
  taken: boolean;
  notes?: string;
}

export type MedicationGroup = 'morning' | 'midday' | 'evening' | 'night';

export const MEDICATION_GROUPS = [
  { id: 'morning', label: 'Morning', icon: 'Sunrise' },
  { id: 'midday', label: 'Midday', icon: 'Sun' },
  { id: 'evening', label: 'Evening', icon: 'Sunset' },
  { id: 'night', label: 'Night', icon: 'Moon' },
] as const;