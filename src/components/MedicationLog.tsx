import React from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MedicationLog } from '@/types/medication';
import { Check, X } from 'lucide-react';

interface MedicationLogListProps {
  logs: MedicationLog[];
  medicationName: string;
}

export function MedicationLogList({ logs, medicationName }: MedicationLogListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">History for {medicationName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {log.taken ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm font-medium">
                  {format(new Date(log.timestamp), 'PPp')}
                </span>
              </div>
              {log.notes && (
                <span className="text-sm text-muted-foreground">{log.notes}</span>
              )}
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No medication logs yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}