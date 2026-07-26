import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Building2, Settings, Scissors, Users, CalendarDays, BookOpen, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { BreadcrumbItem } from '@/types';
import { useState } from 'react';

// Subcomponents
import VenueServices from './services';
import VenueStaff from './staff';
import VenueSchedule from './schedule';
import VenueBookings from './bookings';

const CATEGORIES = [
    { value: 'Barbershop', label: 'Barbershop' },
    { value: 'Massage Salon', label: 'Massage Salon' },
    { value: 'Repair Shop', label: 'Repair & Service' },
    { value: 'Beauty Salon', label: 'Beauty Salon' },
    { value: 'Medical / Dental', label: 'Medical Clinic' },
    { value: 'Fitness / Sport', label: 'Fitness & Sports' },
    { value: 'Tutoring / Education', label: 'Education' },
    { value: 'Other', label: 'Other Business' },
];

const PRESET_COLORS = [
    { name: 'Dark Zinc', hex: '#18181b' },
    { name: 'Ocean Blue', hex: '#0284c7' },
    { name: 'Emerald Green', hex: '#059669' },
    { name: 'Rose Red', hex: '#e11d48' },
    { name: 'Indigo Purple', hex: '#4f46e5' },
    { name: 'Amber Gold', hex: '#d97706' },
];

interface Service {
    id: number;
    name: string;
    description: string | null;
    duration_minutes: number;
    price: number;
    is_active: boolean;
    sort_order: number;
}

interface StaffMember {
    id: number;
    name: string;
    avatar: string | null;
    position: string | null;
    is_active: boolean;
    services?: Service[];
}

interface WorkingHour {
    id: number;
    day_of_week: number;
    open_time: string;
    close_time: string;
    is_day_off: boolean;
}

interface Booking {
    id: number;
    client_name: string;
    client_email: string;
    client_phone: string | null;
    booking_date: string;
    start_time: string;
    end_time: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    notes: string | null;
    service: Service;
    staff_member: StaffMember;
}

interface Venue {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    category: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    cover_image: string | null;
    logo: string | null;
    primary_color: string;
    is_active: boolean;
    services: Service[];
    staff_members: StaffMember[];
    working_hours: WorkingHour[];
}

interface Props {
    venue: Venue;
    bookings: Booking[];
}

export default function VenueEdit({ venue, bookings }: Props) {
    const [activeTab, setActiveTab] = useState('details');

    const { data, setData, put, processing, errors } = useForm({
        name: venue.name || '',
        slug: venue.slug || '',
        description: venue.description || '',
        category: venue.category || 'Barbershop',
        phone: venue.phone || '',
        address: venue.address || '',
        city: venue.city || '',
        primary_color: venue.primary_color || '#18181b',
        is_active: venue.is_active ?? true,
    });

    const { delete: destroyVenue, processing: deleting } = useForm({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/dashboard/venues/${venue.id}`);
    };

    const handleDelete = () => {
        if (confirm('Are you absolutely sure you want to delete this venue? All associated services, staff members and bookings will be permanently deleted.')) {
            destroyVenue(`/dashboard/venues/${venue.id}`);
        }
    };

    return (
        <>
            <Head title={`Manage ${venue.name}`} />

            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-neutral-200 dark:border-neutral-800 pb-5">
                    <div className="flex items-center gap-3">
                        <Button asChild variant="ghost" size="icon" className="rounded-full h-9 w-9">
                            <Link href="/dashboard/venues">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                                {venue.name}
                            </h1>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                Manage details, services, employees and schedule.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm" className="rounded-xl h-10 px-4">
                            <a href={`/${venue.slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                                <ExternalLink className="h-4 w-4" />
                                View Public Page
                            </a>
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-5 max-w-2xl bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl h-11 border border-neutral-200 dark:border-neutral-800">
                        <TabsTrigger value="details" className="rounded-lg text-xs font-semibold py-2">
                            <Settings className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
                            Info
                        </TabsTrigger>
                        <TabsTrigger value="services" className="rounded-lg text-xs font-semibold py-2">
                            <Scissors className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
                            Services
                        </TabsTrigger>
                        <TabsTrigger value="staff" className="rounded-lg text-xs font-semibold py-2">
                            <Users className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
                            Staff
                        </TabsTrigger>
                        <TabsTrigger value="schedule" className="rounded-lg text-xs font-semibold py-2">
                            <CalendarDays className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
                            Schedule
                        </TabsTrigger>
                        <TabsTrigger value="bookings" className="rounded-lg text-xs font-semibold py-2">
                            <BookOpen className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
                            Bookings
                        </TabsTrigger>
                    </TabsList>

                    {/* Details Tab */}
                    <TabsContent value="details" className="mt-6 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Card className="border-neutral-200 dark:border-neutral-800">
                                <CardHeader>
                                    <CardTitle className="text-lg">Venue Settings</CardTitle>
                                    <CardDescription>
                                        Update your business profile and booking page settings.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
                                        <div className="space-y-0.5">
                                            <Label className="font-semibold text-neutral-950 dark:text-white">Active Status</Label>
                                            <span className="text-xs text-neutral-500 block">
                                                When inactive, your public page will show a 404 error and reject booking requests.
                                            </span>
                                        </div>
                                        <Switch
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', checked)}
                                        />
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="name">Venue Name</Label>
                                            <Input
                                                id="name"
                                                required
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="rounded-xl border-neutral-200 dark:border-neutral-800"
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="slug">Custom URL Slug</Label>
                                            <div className="flex items-center">
                                                <span className="flex h-9 items-center rounded-l-xl border border-r-0 border-neutral-200 bg-neutral-50 px-3 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
                                                    booking.app/
                                                </span>
                                                <Input
                                                    id="slug"
                                                    required
                                                    value={data.slug}
                                                    onChange={(e) => setData('slug', e.target.value)}
                                                    className="rounded-r-xl rounded-l-none border-neutral-200 dark:border-neutral-800"
                                                />
                                            </div>
                                            <InputError message={errors.slug} />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="category">Business Category</Label>
                                            <Select
                                                value={data.category || ''}
                                                onValueChange={(val) => setData('category', val)}
                                            >
                                                <SelectTrigger className="rounded-xl border-neutral-200 dark:border-neutral-800">
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                                                    {CATEGORIES.map((item) => (
                                                        <SelectItem key={item.value} value={item.value}>
                                                            {item.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.category} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="phone">Contact Phone</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="rounded-xl border-neutral-200 dark:border-neutral-800"
                                            />
                                            <InputError message={errors.phone} />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="address">Address</Label>
                                            <Input
                                                id="address"
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                className="rounded-xl border-neutral-200 dark:border-neutral-800"
                                            />
                                            <InputError message={errors.address} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                value={data.city}
                                                onChange={(e) => setData('city', e.target.value)}
                                                className="rounded-xl border-neutral-200 dark:border-neutral-800"
                                            />
                                            <InputError message={errors.city} />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="description">About Venue</Label>
                                        <Textarea
                                            id="description"
                                            rows={3}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="rounded-xl border-neutral-200 dark:border-neutral-800"
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    {/* Color selector */}
                                    <div className="space-y-3 border-t border-neutral-100 dark:border-neutral-800 pt-5">
                                        <div>
                                            <Label className="text-sm font-semibold">Theme Color</Label>
                                            <span className="text-xs text-neutral-400 block mt-0.5">
                                                This color will style your public booking widget background and main action buttons.
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2.5">
                                            {PRESET_COLORS.map((c) => (
                                                <button
                                                    key={c.hex}
                                                    type="button"
                                                    onClick={() => setData('primary_color', c.hex)}
                                                    className={`h-9 items-center px-3 gap-2 flex rounded-lg text-xs font-semibold border transition-all duration-200 ${
                                                        data.primary_color === c.hex
                                                            ? 'border-neutral-950 dark:border-white ring-2 ring-neutral-400 dark:ring-neutral-700'
                                                            : 'border-neutral-200 dark:border-neutral-800 opacity-80 hover:opacity-100'
                                                    }`}
                                                >
                                                    <span
                                                        className="h-3.5 w-3.5 rounded-full border border-black/10"
                                                        style={{ backgroundColor: c.hex }}
                                                    />
                                                    {c.name}
                                                </button>
                                            ))}
                                            <div className="flex items-center gap-2 pl-1">
                                                <Input
                                                    type="color"
                                                    value={data.primary_color}
                                                    onChange={(e) => setData('primary_color', e.target.value)}
                                                    className="h-8 w-10 p-0 border-none bg-transparent cursor-pointer rounded"
                                                />
                                                <span className="text-xs text-neutral-400 font-mono">{data.primary_color}</span>
                                            </div>
                                        </div>
                                        <InputError message={errors.primary_color} />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-between items-center mt-6">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="rounded-xl h-11 px-5 flex items-center gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Venue
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="shimmer-btn bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 rounded-xl h-11 px-5"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </TabsContent>

                    {/* Services Tab */}
                    <TabsContent value="services" className="mt-6">
                        <VenueServices venue={venue} services={venue.services} />
                    </TabsContent>

                    {/* Staff Tab */}
                    <TabsContent value="staff" className="mt-6">
                        <VenueStaff venue={venue} staff={venue.staff_members} services={venue.services} />
                    </TabsContent>

                    {/* Schedule Tab */}
                    <TabsContent value="schedule" className="mt-6">
                        <VenueSchedule venue={venue} schedule={venue.working_hours} />
                    </TabsContent>

                    {/* Bookings Tab */}
                    <TabsContent value="bookings" className="mt-6">
                        <VenueBookings venue={venue} bookings={bookings} />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}

VenueEdit.layout = {
    breadcrumbs: [
        { title: 'Venues', href: '/dashboard/venues' },
        { title: 'Manage', href: '' },
    ],
};
