'use client';
import { useEffect, useState } from 'react';
import type { Reminder } from '@/types/reminder';
import { loadReminders, saveReminders } from '@/lib/storage';

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    setReminders(loadReminders());
  }, []);

  useEffect(() => {
    saveReminders(reminders);
  }, [reminders]);

  const addReminder = (r: Reminder) => setReminders(prev => [r, ...prev]);
  const removeReminder = (id: string) => setReminders(prev => prev.filter(r => r.id !== id));
  const updateReminder = (r: Reminder) => setReminders(prev => prev.map(x => x.id === r.id ? r : x));

  return { reminders, addReminder, removeReminder, updateReminder };
}