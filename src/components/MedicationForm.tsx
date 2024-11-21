import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Medication, MEDICATION_GROUPS } from '../types/medication';
import * as Icons from 'lucide-react';

const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  prescriber: z.string().optional(),
  startDate: z.string().optional(),
  lastRefillDate: z.string().optional(),
  nextRefillDate: z.string().optional(),
  instructions: z.string().optional(),
  isAsNeeded: z.boolean().default(false),
  group: z.enum(['morning', 'midday', 'evening', 'night']).optional(),
  icon: z.string().optional(),
});

type MedicationFormData = z.infer<typeof medicationSchema>;

interface MedicationFormProps {
  onSubmit: (data: Medication) => void;
  onCancel: () => void;
  initialData?: Medication;
}

const MEDICATION_ICONS = [
  'Pill', 'Capsule', 'Syringe', 'Droplet', 'Heart', 'Activity',
  'Thermometer', 'Stethoscope', 'FirstAid', 'Tablets'
] as const;

export function MedicationForm({ onSubmit, onCancel, initialData }: MedicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: initialData || {
      isAsNeeded: false,
    },
  });

  const onFormSubmit = (data: MedicationFormData) => {
    onSubmit({
      id: initialData?.id || crypto.randomUUID(),
      ...data,
    });
  };

  const selectedGroup = watch('group');
  const selectedIcon = watch('icon');

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Medication Name*</Label>
          <Input
            id="name"
            {...register('name')}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="group">Time of Day</Label>
          <Select 
            value={selectedGroup} 
            onValueChange={(value) => setValue('group', value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time of day" />
            </SelectTrigger>
            <SelectContent>
              {MEDICATION_GROUPS.map((group) => {
                const Icon = Icons[group.icon as keyof typeof Icons];
                return (
                  <SelectItem key={group.id} value={group.id}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{group.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="icon">Icon</Label>
          <Select 
            value={selectedIcon} 
            onValueChange={(value) => setValue('icon', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an icon" />
            </SelectTrigger>
            <SelectContent>
              {MEDICATION_ICONS.map((iconName) => {
                const Icon = Icons[iconName as keyof typeof Icons];
                return (
                  <SelectItem key={iconName} value={iconName}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{iconName}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="dosage">Dosage</Label>
          <Input id="dosage" {...register('dosage')} />
        </div>

        <div>
          <Label htmlFor="frequency">Frequency</Label>
          <Input id="frequency" {...register('frequency')} />
        </div>

        <div>
          <Label htmlFor="prescriber">Prescriber</Label>
          <Input id="prescriber" {...register('prescriber')} />
        </div>

        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" type="date" {...register('startDate')} />
        </div>

        <div>
          <Label htmlFor="lastRefillDate">Last Refill Date</Label>
          <Input id="lastRefillDate" type="date" {...register('lastRefillDate')} />
        </div>

        <div>
          <Label htmlFor="nextRefillDate">Next Refill Date</Label>
          <Input id="nextRefillDate" type="date" {...register('nextRefillDate')} />
        </div>

        <div>
          <Label htmlFor="instructions">Special Instructions</Label>
          <Input id="instructions" {...register('instructions')} />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isAsNeeded"
            {...register('isAsNeeded')}
            className="rounded border-gray-300"
          />
          <Label htmlFor="isAsNeeded">Take as needed</Label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Add'} Medication
        </Button>
      </div>
    </form>
  );
}