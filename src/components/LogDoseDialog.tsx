import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Medication } from '@/types/medication';
import { format } from 'date-fns';

const logSchema = z.object({
  notes: z.string().optional(),
  taken: z.boolean().default(true),
  timestamp: z.string(),
});

type LogFormData = z.infer<typeof logSchema>;

interface LogDoseDialogProps {
  medication: Medication;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogDose: (medicationId: string, data: { notes?: string; taken: boolean; timestamp: string }) => void;
}

export function LogDoseDialog({
  medication,
  open,
  onOpenChange,
  onLogDose,
}: LogDoseDialogProps) {
  const { register, handleSubmit, reset } = useForm<LogFormData>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      taken: true,
      timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    },
  });

  const onSubmit = (data: LogFormData) => {
    onLogDose(medication.id, data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Dose - {medication.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="timestamp">Time Taken</Label>
            <Input
              type="datetime-local"
              id="timestamp"
              {...register('timestamp')}
            />
          </div>
          <div>
            <Label htmlFor="taken">Status</Label>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="taken"
                {...register('taken')}
                className="rounded border-gray-300"
              />
              <Label htmlFor="taken">Medication taken</Label>
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              {...register('notes')}
              placeholder="Add any notes about this dose"
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Log</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}