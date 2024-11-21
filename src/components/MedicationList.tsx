import React from 'react';
import { MedicationCard } from './MedicationCard';
import { Medication, MEDICATION_GROUPS } from '@/types/medication';
import * as Icons from 'lucide-react';

interface MedicationListProps {
  medications: Medication[];
  onLogDose: (id: string) => void;
  onViewHistory: (id: string) => void;
  onEdit: (medication: Medication) => void;
}

export function MedicationList({ medications, onLogDose, onViewHistory, onEdit }: MedicationListProps) {
  const scheduledMeds = medications.filter(med => !med.isAsNeeded);
  const asNeededMeds = medications.filter(med => med.isAsNeeded);

  const renderMedicationGroup = (groupId: string) => {
    const groupMeds = scheduledMeds.filter(med => med.group === groupId);
    if (groupMeds.length === 0) return null;

    const group = MEDICATION_GROUPS.find(g => g.id === groupId);
    const Icon = group ? Icons[group.icon as keyof typeof Icons] : null;

    return (
      <div key={groupId} className="space-y-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
          <h3 className="text-lg font-medium">{group?.label}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupMeds.map(medication => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              onLogDose={onLogDose}
              onViewHistory={onViewHistory}
              onEdit={onEdit}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Scheduled Medications */}
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Scheduled Medications</h2>
        {MEDICATION_GROUPS.map(group => renderMedicationGroup(group.id))}
        {scheduledMeds.filter(med => !med.group).length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Other Scheduled Medications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scheduledMeds
                .filter(med => !med.group)
                .map(medication => (
                  <MedicationCard
                    key={medication.id}
                    medication={medication}
                    onLogDose={onLogDose}
                    onViewHistory={onViewHistory}
                    onEdit={onEdit}
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      {/* As Needed Medications */}
      {asNeededMeds.length > 0 && (
        <div className="space-y-4 pt-8 border-t">
          <h2 className="text-2xl font-semibold">As Needed Medications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {asNeededMeds.map(medication => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                onLogDose={onLogDose}
                onViewHistory={onViewHistory}
                onEdit={onEdit}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}