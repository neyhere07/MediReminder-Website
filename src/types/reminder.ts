export type Reminder = {
  id: string;
  name: string;
  dosage?: string;
  times: string[];  // e.g. ["08:00","20:00"]
  startDate?: string;
  endDate?: string;
  notes?: string;
  taken?: boolean;
};