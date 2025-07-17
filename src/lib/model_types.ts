export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  userId: string;
};

export type Reminder = {
  id: string;
  type: string;
  sendAt: string;
  sent: boolean;
  appointment: Appointment;
};

export type Appointment = {
  id: string;
  appointmentAt: string;
  notes: string;
  status: string;
  user: User;
  customer: Customer;
  reminders: Reminder[];
};

export type User = {
  id: string;
  email: string;
  name: string;
  pronoun: string;
  companyName?: string;
  location: string;
  phone: string;
  role: string;
  allowOverlappingAppointments: boolean;
  timeZone: string;
  customers: Customer[];
  appointments: Appointment[];
};
