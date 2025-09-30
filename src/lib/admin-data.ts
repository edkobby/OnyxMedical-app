
import type { LucideIcon } from 'lucide-react';
import { UserPlus, CalendarPlus, MessageCirclePlus, FileUp } from 'lucide-react';
import { Doctor } from './types';


export interface Appointment {
  id: string,
  patientName: string;
  patientEmail: string;
  doctorName: string;
  service: string;
  dateTime: string;
  status: 'Upcoming' | 'Completed' | 'Canceled';
}

export interface Patient {
    id: string;
    name: string;
    email: string;
    registeredDate: string;
    lastVisit: string;
    status: 'Active' | 'Inactive';
}

export interface AdminNotification {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    read: boolean;
}

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: 'Admin' | 'Doctor' | 'Staff' | 'Accountant';
    status: 'Active' | 'Pending' | 'Inactive';
    lastLogin: string;
}

export const weeklyAppointmentsChartData = [
  { name: 'Mon', scheduled: 50, completed: 40 },
  { name: 'Tue', scheduled: 60, completed: 52 },
  { name: 'Wed', scheduled: 75, completed: 65 },
  { name: 'Thu', scheduled: 55, completed: 48 },
  { name: 'Fri', scheduled: 80, completed: 72 },
  { name: 'Sat', scheduled: 30, completed: 25 },
];

export const revenueChartData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 5500 },
];

export const recentAppointments = [
  { id: '1', patientName: 'Olivia Martin', patientEmail: 'olivia.martin@email.com', doctorName: 'Dr. Johnson', status: 'Completed', service: "Annual Checkup", dateTime: "2024-07-10 09:00 AM" },
  { id: '2', patientName: 'Jackson Lee', patientEmail: 'jackson.lee@email.com', doctorName: 'Dr. Williams', status: 'Upcoming', service: "Vaccination", dateTime: "2024-08-20 10:30 AM" },
  { id: '3', patientName: 'Isabella Nguyen', patientEmail: 'isabella.nguyen@email.com', doctorName: 'Dr. Brown', status: 'Upcoming', service: "Follow-up", dateTime: "2024-08-22 02:00 PM" },
  { id: '4', patientName: 'William Kim', patientEmail: 'will@email.com', doctorName: 'Dr. Quampah', status: 'Completed', service: "Fertility Consult", dateTime: "2024-07-05 11:00 AM" },
  { id: '5', patientName: 'Sophia Davis', patientEmail: 'sophia.davis@email.com', doctorName: 'Dr. Johnson', status: 'Canceled', service: "Wellness Exam", dateTime: "2024-07-12 03:00 PM" },
];

export const adminAppointments: Appointment[] = [
  ...recentAppointments,
  { id: '6', patientName: 'Liam Garcia', patientEmail: 'liam.g@email.com', doctorName: 'Dr. Williams', status: 'Upcoming', service: 'Pediatric Checkup', dateTime: '2024-08-15 10:00 AM' },
  { id: '7', patientName: 'Emma Rodriguez', patientEmail: 'emma.r@email.com', doctorName: 'Dr. Brown', status: 'Upcoming', service: 'Internal Medicine Follow-up', dateTime: '2024-08-16 02:30 PM' },
  { id: '8', patientName: 'Noah Martinez', patientEmail: 'noah.m@email.com', doctorName: 'Dr. Quampah', status: 'Completed', service: 'Fertility Consultation', dateTime: '2024-07-20 11:00 AM' },
  { id: '9', patientName: 'Ava Hernandez', patientEmail: 'ava.h@email.com', doctorName: 'Dr. Johnson', status: 'Completed', service: 'Gynecology Exam', dateTime: '2024-07-18 09:45 AM' },
  { id: '10', patientName: 'James Wilson', patientEmail: 'james.w@email.com', doctorName: 'Dr. Williams', status: 'Canceled', service: 'Vaccination', dateTime: '2024-07-15 03:00 PM' },
];


export const adminDoctors: Omit<Doctor, 'id'>[] = [
    { name: 'Rev. Dr. Anthony Quampah', specialty: 'Fertility Specialist', avatar: '/images/doctors/anthony-quampah.png', status: 'Online', patients: 120 },
    { name: 'Dr. Alice Johnson', specialty: 'Gynecologist', avatar: '/images/doctors/alice-johnson.png', status: 'Offline', patients: 250 },
    { name: 'Dr. Robert Williams', specialty: 'Pediatrician', avatar: '/images/doctors/robert-williams.png', status: 'Online', patients: 300 },
    { name: 'Dr. Emily Brown', specialty: 'Internal Medicine', avatar: '/images/doctors/emily-brown.png', status: 'On Break', patients: 180 },
];

export const adminPatients: Patient[] = [
  { id: 'p1', name: 'Olivia Martin', email: 'olivia.martin@email.com', registeredDate: '2023-01-15', lastVisit: '2024-07-10', status: 'Active' },
  { id: 'p2', name: 'Jackson Lee', email: 'jackson.lee@email.com', registeredDate: '2023-02-20', lastVisit: '2024-08-01', status: 'Active' },
  { id: 'p3', name: 'Sophia Davis', email: 'sophia.davis@email.com', registeredDate: '2022-11-10', lastVisit: '2024-05-18', status: 'Inactive' },
  { id: 'p4', name: 'Liam Garcia', email: 'liam.g@email.com', registeredDate: '2023-05-01', lastVisit: '2024-07-22', status: 'Active' },
];

export const adminNotifications: AdminNotification[] = [
    { id: 'n1', title: 'New Patient Registered', description: 'Liam Garcia has created an account.', icon: UserPlus, read: false },
    { id: 'n2', title: 'New Appointment Request', description: 'Emma Rodriguez requested an appointment.', icon: CalendarPlus, read: false },
    { id: 'n3', title: 'New Message', description: 'You have a new message from Jane Doe.', icon: MessageCirclePlus, read: true },
    { id: 'n4', title: 'Document Uploaded', description: 'Olivia Martin uploaded a new document.', icon: FileUp, read: true },
];

export const adminUsers: AdminUser[] = [
    { id: 1, name: 'Admin User', email: 'admin@onyx.com', role: 'Admin', status: 'Active', lastLogin: '2 hours ago' },
    { id: 2, name: 'Rev. Dr. Anthony Quampah', email: 'a.quampah@onyx.com', role: 'Doctor', status: 'Active', lastLogin: '1 day ago' },
    { id: 3, name: 'Alice Johnson', email: 'a.johnson@onyx.com', role: 'Doctor', status: 'Active', lastLogin: '5 hours ago' },
    { id: 4, name: 'Michael Chen', email: 'm.chen@onyx.com', role: 'Accountant', status: 'Active', lastLogin: '3 days ago' },
    { id: 5, name: 'Sarah Lee', email: 's.lee@onyx.com', role: 'Staff', status: 'Pending', lastLogin: 'N/A' },
];

// Data for Analytics Page
export const servicePopularityData = [
  { service: "Fertility (IVF)", count: 280 },
  { service: "Gynecology", count: 450 },
  { service: "General OPD", count: 620 },
  { service: "Pediatrics", count: 310 },
  { service: "Surgery", count: 150 },
  { service: "Laboratory", count: 850 },
];

export const patientDemographicsData = [
  { name: '0-17', value: 310 },
  { name: '18-35', value: 1250 },
  { name: '36-55', value: 870 },
  { name: '56+', value: 420 },
];

export const doctorPerformanceData = [
    { id: 1, name: 'Rev. Dr. Anthony Quampah', specialty: 'Fertility Specialist', appointments: 180, rating: 4.9, satisfaction: 98 },
    { id: 2, name: 'Dr. Alice Johnson', specialty: 'Gynecologist', appointments: 250, rating: 4.8, satisfaction: 95 },
    { id: 3, name: 'Dr. Robert Williams', specialty: 'Pediatrician', appointments: 300, rating: 4.9, satisfaction: 97 },
    { id: 4, name: 'Dr. Emily Brown', specialty: 'Internal Medicine', appointments: 210, rating: 4.7, satisfaction: 92 },
];

export const appointmentFunnelData = [
    { value: 100, name: 'Total Visits', fill: '#8884d8' },
    { value: 80, name: 'Appointments Requested', fill: '#83a6ed' },
    { value: 65, name: 'Appointments Confirmed', fill: '#8dd1e1' },
    { value: 60, name: 'Attended', fill: '#82ca9d' },
];
