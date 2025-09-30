

import { format, addDays, subDays } from 'date-fns';

export interface Appointment {
  id: string;
  date: string;
  doctor: string;
  department: string;
  service: string;
  status: 'Upcoming' | 'Completed' | 'Canceled';
  diagnosis?: string;
}

export interface Prescription {
  id: string;
  name: string;
  doctor: string;
  dosage: string;
  frequency: string;
  status: 'Active' | 'Expired';
  refillsLeft: number;
}

export interface Bill {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Due' | 'Overdue';
}

export interface MedicalRecord {
  id: string;
  date: string;
  doctor: string;
  department: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  files: { name: string; url: string }[];
}

export interface DashboardNotification {
    id: string;
    title: string;
    description: string;
    read: boolean;
}

const today = new Date();

export const upcomingAppointments: Appointment[] = [
  { id: '1', date: format(addDays(today, 2), 'yyyy-MM-dd HH:mm'), doctor: 'Dr. Alice Johnson', department: 'Gynecology', service: 'Annual Check-up', status: 'Upcoming' },
  { id: '2', date: format(addDays(today, 10), 'yyyy-MM-dd HH:mm'), doctor: 'Dr. Robert Williams', department: 'Pediatrics', service: 'Vaccination', status: 'Upcoming' },
  { id: '3', date: format(addDays(today, 25), 'yyyy-MM-dd HH:mm'), doctor: 'Dr. Emily Brown', department: 'Internal Medicine', service: 'Follow-up Consultation', status: 'Upcoming' },
];

export const recentAppointments: Appointment[] = [
  { id: '4', date: format(subDays(today, 15), 'yyyy-MM-dd HH:mm'), doctor: 'Dr. Emily Brown', department: 'Internal Medicine', service: 'Initial Consultation', status: 'Completed', diagnosis: 'Hypertension' },
  { id: '5', date: format(subDays(today, 45), 'yyyy-MM-dd HH:mm'), doctor: 'Dr. Anthony Quampah', department: 'Fertility', service: 'Fertility Assessment', status: 'Completed', diagnosis: 'Normal' },
  { id: '6', date: format(subDays(today, 90), 'yyyy-MM-dd HH:mm'), doctor: 'Dr. Alice Johnson', department: 'Gynecology', service: 'Annual Check-up', status: 'Completed', diagnosis: 'Normal' },
];

export const canceledAppointments: Appointment[] = [
  { id: '7', date: format(subDays(today, 7), 'yyyy-MM-dd HH:mm'), doctor: 'Dr. Robert Williams', department: 'Pediatrics', service: 'Sick Visit', status: 'Canceled' },
];

export const activePrescriptions: Prescription[] = [
  { id: 'p1', name: 'Lisinopril', doctor: 'Dr. Emily Brown', dosage: '10mg', frequency: 'Once daily', status: 'Active', refillsLeft: 2 },
  { id: 'p2', name: 'Prenatal Vitamins', doctor: 'Dr. Alice Johnson', dosage: '1 tablet', frequency: 'Once daily', status: 'Active', refillsLeft: 1 },
];

export const pastPrescriptions: Prescription[] = [
  { id: 'p3', name: 'Amoxicillin', doctor: 'Dr. Robert Williams', dosage: '500mg', frequency: 'Twice daily for 7 days', status: 'Expired', refillsLeft: 0 },
];

export const billingData: Bill[] = [
    { id: 'b1', date: format(subDays(today, 15), 'yyyy-MM-dd'), description: 'Consultation with Dr. Brown', amount: 150.00, status: 'Overdue' },
    { id: 'b2', date: format(subDays(today, 45), 'yyyy-MM-dd'), description: 'Fertility Assessment', amount: 350.00, status: 'Paid' },
    { id: 'b3', date: format(subDays(today, 90), 'yyyy-MM-dd'), description: 'Annual GYN Check-up', amount: 200.00, status: 'Paid' },
];

export const medicalRecordsData: MedicalRecord[] = [
  {
    id: 'mr1',
    date: format(subDays(today, 15), 'yyyy-MM-dd'),
    doctor: 'Dr. Emily Brown',
    department: 'Internal Medicine',
    reason: 'Routine physical and blood pressure check.',
    diagnosis: 'Essential Hypertension',
    treatment: 'Prescribed Lisinopril 10mg daily. Advised on dietary changes and regular exercise.',
    files: [{ name: 'blood_test_results.pdf', url: '#' }],
  },
  {
    id: 'mr2',
    date: format(subDays(today, 45), 'yyyy-MM-dd'),
    doctor: 'Dr. Anthony Quampah',
    department: 'Fertility',
    reason: 'Initial fertility consultation.',
    diagnosis: 'Unexplained Infertility (Initial Assessment)',
    treatment: 'Recommended baseline hormone tests and further monitoring. Discussed lifestyle factors.',
    files: [],
  },
];

export const dashboardNotifications: DashboardNotification[] = [
    { id: 'dn1', title: 'New Message from Dr. Brown', description: 'Your recent lab results are available.', read: false },
    { id: 'dn2', title: 'Appointment Confirmed', description: 'Your appointment with Dr. Johnson is confirmed.', read: false },
    { id: 'dn3', title: 'Prescription Refilled', description: 'Your prescription for Lisinopril has been refilled.', read: true },
];
