import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, User, RefreshCcw, History, Settings2 } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { Medication } from '@/types/medication';
import * as Icons from 'lucide-react';

interface MedicationCardProps {
  medication: Medication;
  onLogDose: (id: string) => void;
  onViewHistory: (id: string) => void;
  onEdit: (medication: Medication) => void;
}

export function MedicationCard({ 
  medication, 
  onLogDose, 
  onViewHistory,
  onEdit,
}: MedicationCardProps) {
  const nextDoseIn = medication.nextDose 
    ? formatDistanceToNow(new Date(medication.nextDose))
    : 'Now';

  const Icon = medication.icon ? Icons[medication.icon as keyof typeof Icons] : Icons.Pill;

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <span>{medication.name}</span>
          </div>
          {medication.dosage && (
            <span className="text-sm font-normal text-muted-foreground">
              {medication.dosage}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!medication.isAsNeeded && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Next dose: {nextDoseIn}</span>
            </div>
          )}
          {medication.nextRefillDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Next refill: {format(new Date(medication.nextRefillDate), 'PP')}</span>
            </div>
          )}
          {medication.prescriber && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Dr. {medication.prescriber}</span>
            </div>
          )}
          {medication.instructions && (
            <p className="text-sm bg-muted/50 p-2 rounded">
              {medication.instructions}
            </p>
          )}
          <div className="flex gap-2 pt-4">
            <Button 
              className="flex-1"
              onClick={() => onLogDose(medication.id)}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Log Dose
            </Button>
            <Button
              variant="outline"
              onClick={() => onViewHistory(medication.id)}
            >
              <History className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => onEdit(medication)}
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}