'use client';
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useReminders } from '@/hooks/useReminders';
import type { Reminder } from '@/types/reminder';

const schema = z.object({
    name: z.string().min(1, 'Medicine name is required'),
    dosage: z.string().optional(),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:MM'),
    notes: z.string().optional(),
    frequency: z.enum(["daily", "weekly", "monthly"])
});


type FormValues = z.infer<typeof schema>;

export default function Home() {
    const { reminders, addReminder, removeReminder, updateReminder } = useReminders();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { name: '', dosage: '', time: '', notes: '', frequency: 'daily' },
    });

    const onSubmit = (values: FormValues) => {
        const newReminder: Reminder = {
            id: crypto.randomUUID(),
            name: values.name,
            dosage: values.dosage || '',
            times: [values.time],
            notes: values.notes || '',
            frequency: values.frequency,
            nextDate: new Date()
        };
        let split: string[] = values.time.split(":");
        newReminder.nextDate.setHours(Number(split[0]), Number(split[1]), 0, 0);
        addReminder(newReminder);
        reset();
    };

    const addDays = (date: Date, days: number): Date => {
        return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
    };
    
    

    useEffect(() => {
        if (Notification.permission === "default") {
            Notification.requestPermission();
        }

        const addNotification = () => {

            reminders.map((reminder: Reminder) => {
                reminder.nextDate = new Date(reminder.nextDate);
                if (reminder.nextDate < new Date()) {
                    while (reminder.nextDate < new Date()) {
                        if (reminder.frequency == 'daily') {
                            reminder.nextDate = addDays(reminder.nextDate, 1);
                        }
                        else if (reminder.frequency == 'weekly') {
                            reminder.nextDate = addDays(reminder.nextDate, 7);
                        }
                        else if (reminder.frequency == 'monthly') {
                            reminder.nextDate = addDays(reminder.nextDate, 30);
                        }
                    }
                    updateReminder(reminder);
                }


                let timeDiff: number = reminder.nextDate.getTime() - new Date().getTime();

                if (timeDiff < 1000 * 60 * 60 * 24) {
                    setTimeout(() => {
                        if (Notification.permission === "granted") {
                            new Notification(`Reminder for taking your medicine , ${reminder.name}`);
                        }

                    }, timeDiff);

                }
            })
        }

        addNotification();
        const interval = setInterval(() => {
            addNotification();
        }, 1000 * 60 * 60 * 24);

        return () => {
            clearInterval(interval);

        }
    }, [reminders])


    return (
        <main className="mx-auto max-w-2xl p-6 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">MediReminder</h1>
            </header>

            <section className="rounded-2xl border bg-white p-4 shadow-sm">
                <h2 className="mb-3 text-lg font-semibold">Add reminder</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                        <label className="block text-sm font-medium">Medicine name</label>
                        <input className="mt-1 w-full rounded-md border px-3 py-2" {...register('name')} placeholder="Metformin" />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>
                    <div className="sm:col-span-1">
                        <label className="block text-sm font-medium">Dosage</label>
                        <input className="mt-1 w-full rounded-md border px-3 py-2" {...register('dosage')} placeholder="500 mg" />
                    </div>
                    <div className="sm:col-span-1">
                        <label className="block text-sm font-medium">Time (HH:MM)</label>
                        <input className="mt-1 w-full rounded-md border px-3 py-2" {...register('time')} placeholder="08:00" />
                        {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>}
                    </div>
                    <div className="sm:col-span-1">
                        <label className="block text-sm font-medium">Frequency </label>
                        <select id="frequency" name="frequency">
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium">Notes</label>
                        <textarea className="mt-1 w-full rounded-md border px-3 py-2" rows={2} {...register('notes')} placeholder="Before breakfast" />
                    </div>
                    <div className="sm:col-span-2">
                        <button type="submit" className="w-full rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700">
                            Add reminder
                        </button>
                    </div>
                </form>
            </section>

            <section className="space-y-3">
                <h2 className="text-lg font-semibold">Your reminders</h2>
                {reminders.length === 0 ? (
                    <p className="text-sm text-gray-600">No reminders yet — add one above.</p>
                ) : (
                    <ul className="space-y-2">
                        {reminders.map(r => (
                            <li key={r.id} className="flex items-center justify-between rounded-lg border bg-white p-3">
                                <div>
                                    <p className="font-medium">{r.name} {r.dosage && <span className="text-sm text-gray-600">• {r.dosage}</span>}</p>
                                    <p className="text-sm text-gray-700">Times: {r.times.join(', ')}</p>
                                    {r.notes && <p className="text-xs text-gray-500">Notes: {r.notes}</p>}
                                </div>
                                <button onClick={() => removeReminder(r.id)} className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50">
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}
