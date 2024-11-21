import React, { useState } from 'react';
import { MedicationList } from './components/MedicationList';
import { MedicationForm } from './components/MedicationForm';
import { MedicationLogList } from './components/MedicationLog';
import { LogDoseDialog } from './components/LogDoseDialog';
import { Pill, PlusCircle } from 'lucide-react';
import { Button } from './components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog';
import { Medication, MedicationLog } from './types/medication';
import { addHours } from 'date-fns';

// Sample data - replace with actual data management
const initialMedications = [
  {
    id: '1',
    name: 'Aspirin',
    dosage: '81mg',
    frequency: 'Once daily',
    prescriber: 'Smith',
    startDate: '2024-02-20',
    instructions: 'Take with food in the morning',
    lastRefillDate: '2024-02-20',
    nextRefillDate: '2024-03-20',
    nextDose: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
    isAsNeeded: false,
    group: 'morning',
    icon: 'Heart',
  },
  {
    id: '2',
    name: 'Ibuprofen',
    dosage: '400mg',
    frequency: 'As needed',
    prescriber: 'Johnson',
    startDate: '2024-02-15',
    instructions: 'Take for pain. Wait at least 4 hours between doses.',
    lastRefillDate: '2024-02-15',
    nextRefillDate: '2024-03-15',
    isAsNeeded: true,
    icon: 'Pill',
  },
];

function App() {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleLogDose = (medicationId: string) => {
    const medication = medications.find((m) => m.id === medicationId);
    if (medication) {
      setSelectedMedication(medication);
      setIsLogDialogOpen(true);
    }
  };

  const handleAddMedication = (medication: Medication) => {
    setMedications((prev) => [...prev, medication]);
    setIsAddDialogOpen(false);
  };

  const handleEditMedication = (updatedMedication: Medication) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === updatedMedication.id ? updatedMedication : m))
    );
    setIsEditDialogOpen(false);
    setSelectedMedication(null);
  };

  const handleLogSubmit = (
    medicationId: string,
    data: { notes?: string; taken: boolean; timestamp: string }
  ) => {
    const newLog: MedicationLog = {
      id: crypto.randomUUID(),
      medicationId,
      timestamp: data.timestamp,
      loggedAt: new Date().toISOString(),
      taken: data.taken,
      notes: data.notes,
    };

    setMedicationLogs((prev) => [...prev, newLog]);

    // Update next dose time for non-as-needed medications
    const medication = medications.find((m) => m.id === medicationId);
    if (medication && !medication.isAsNeeded) {
      setMedications((prev) =>
        prev.map((m) =>
          m.id === medicationId
            ? {
                ...m,
                nextDose: addHours(new Date(data.timestamp), 24).toISOString(), // Simple example - adjust based on frequency
              }
            : m
        )
      );
    }
  };

  const handleViewHistory = (medicationId: string) => {
    const medication = medications.find((m) => m.id === medicationId);
    if (medication) {
      setSelectedMedication(medication);
      setIsHistoryDialogOpen(true);
    }
  };

  const handleEdit = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Pill className="h-8 w-8 text-primary" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">
                MedTracker
              </h1>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Medication
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Medication</DialogTitle>
                </DialogHeader>
                <MedicationForm
                  onSubmit={handleAddMedication}
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MedicationList
          medications={medications}
          onLogDose={handleLogDose}
          onViewHistory={handleViewHistory}
          onEdit={handleEdit}
        />
      </main>

      {selectedMedication && (
        <>
          <LogDoseDialog
            medication={selectedMedication}
            open={isLogDialogOpen}
            onOpenChange={setIsLogDialogOpen}
            onLogDose={handleLogSubmit}
          />
          <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Medication History</DialogTitle>
              </DialogHeader>
              <MedicationLogList
                logs={medicationLogs.filter(
                  (log) => log.medicationId === selectedMedication.id
                )}
                medicationName={selectedMedication.name}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Medication</DialogTitle>
              </DialogHeader>
              <MedicationForm
                initialData={selectedMedication}
                onSubmit={handleEditMedication}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setSelectedMedication(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

export default App;