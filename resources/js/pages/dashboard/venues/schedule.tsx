import { useForm } from '@inertiajs/react';
import { CalendarDays, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import InputError from '@/components/input-error';

interface WorkingHour {
    id: number;
    day_of_week: number;
    open_time: string;
    close_time: string;
    is_day_off: boolean;
}

interface Venue {
    id: number;
    name: string;
}

interface Props {
    venue: Venue;
    schedule: WorkingHour[];
}

const DAY_NAMES = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

// Display days starting from Monday for better UX, but index accordingly
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function VenueSchedule({ venue, schedule }: Props) {
    // We initialize the form with 7 days of hours
    // Ensure all 7 days are represented in correct index mapping
    const initialHours = Array.from({ length: 7 }).map((_, dayOfWeek) => {
        const existing = schedule.find(s => s.day_of_week === dayOfWeek);
        return {
            day_of_week: dayOfWeek,
            // Format H:i:s to H:i for input fields
            open_time: existing ? existing.open_time.substring(0, 5) : '09:00',
            close_time: existing ? existing.close_time.substring(0, 5) : '18:00',
            is_day_off: existing ? Boolean(existing.is_day_off) : false,
        };
    });

    const { data, setData, put, processing, errors } = useForm({
        hours: initialHours,
    });

    const handleFieldChange = (dayIndex: number, field: 'open_time' | 'close_time' | 'is_day_off', value: any) => {
        const updatedHours = [...data.hours];
        const targetIndex = updatedHours.findIndex(h => h.day_of_week === dayIndex);
        if (targetIndex !== -1) {
            updatedHours[targetIndex] = {
                ...updatedHours[targetIndex],
                [field]: value,
            };
            setData('hours', updatedHours);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/dashboard/venues/${venue.id}/working-hours`);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Business Schedule</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Define the opening hours for your venue. Clients will only be able to book slots within these hours.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="border-neutral-200 dark:border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-lg">Weekly Working Hours</CardTitle>
                        <CardDescription>
                            Configure check-in start and end times for each day.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {errors.hours && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs dark:bg-red-950/20 dark:text-red-400 mb-2">
                                <AlertCircle className="h-4 w-4" />
                                <span>Some working hour fields are invalid. Make sure format is HH:MM.</span>
                            </div>
                        )}

                        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {DISPLAY_ORDER.map((dayOfWeek) => {
                                const hourData = data.hours.find(h => h.day_of_week === dayOfWeek);
                                if (!hourData) return null;

                                return (
                                    <div
                                        key={dayOfWeek}
                                        className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 first:pt-0 last:pb-0"
                                    >
                                        <div className="flex items-center gap-3 min-w-[140px]">
                                            <Switch
                                                checked={!hourData.is_day_off}
                                                onCheckedChange={(checked) =>
                                                    handleFieldChange(dayOfWeek, 'is_day_off', !checked)
                                                }
                                            />
                                            <span className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">
                                                {DAY_NAMES[dayOfWeek]}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {!hourData.is_day_off ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex flex-col gap-1">
                                                        <Label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Open Time</Label>
                                                        <Input
                                                            type="time"
                                                            value={hourData.open_time}
                                                            onChange={(e) =>
                                                                handleFieldChange(dayOfWeek, 'open_time', e.target.value)
                                                            }
                                                            className="h-9 w-32 rounded-lg border-neutral-200 dark:border-neutral-800"
                                                        />
                                                    </div>
                                                    <span className="text-neutral-400 pt-5">—</span>
                                                    <div className="flex flex-col gap-1">
                                                        <Label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Close Time</Label>
                                                        <Input
                                                            type="time"
                                                            value={hourData.close_time}
                                                            onChange={(e) =>
                                                                handleFieldChange(dayOfWeek, 'close_time', e.target.value)
                                                            }
                                                            className="h-9 w-32 rounded-lg border-neutral-200 dark:border-neutral-800"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-900/50 py-1.5 px-3 rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800">
                                                    Closed / Day Off
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl shimmer-btn bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 h-11 px-5 flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" />
                        {processing ? 'Saving...' : 'Save Schedule'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
