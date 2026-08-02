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
    gallery: string[] | null;
    portfolio: string[] | null;
    primary_color: string;
    font: string;
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

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: venue.name || '',
        slug: venue.slug || '',
        description: venue.description || '',
        category: venue.category || 'Barbershop',
        phone: venue.phone || '',
        address: venue.address || '',
        city: venue.city || '',
        primary_color: venue.primary_color || '#18181b',
        font: venue.font || 'sans',
        is_active: venue.is_active ?? true,
        logo: null as File | null,
        remove_logo: false,
        existing_gallery: (venue.gallery || []) as string[],
        gallery: [] as File[],
        existing_portfolio: (venue.portfolio || []) as string[],
        portfolio: [] as File[],
    });

    const { delete: destroyVenue, processing: deleting } = useForm({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/dashboard/venues/${venue.id}`);
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

                                    {/* Media & Uploads */}
                                    <div className="space-y-4 border-t border-neutral-100 dark:border-neutral-800 pt-5 text-left">
                                        <div>
                                            <Label className="text-sm font-semibold">Media & Brand Assets</Label>
                                            <span className="text-xs text-neutral-400 block mt-0.5">
                                                Upload your business logo, gallery cover photos, and work portfolio.
                                            </span>
                                        </div>

                                        <div className="grid gap-6 md:grid-cols-3">
                                            {/* 1. LOGO UPLOAD */}
                                            <div className="space-y-2.5">
                                                <Label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Business Logo</Label>
                                                <div className="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex flex-col items-center justify-center bg-neutral-50/50 dark:bg-neutral-900/20 min-h-[140px]">
                                                    {venue.logo && !data.remove_logo ? (
                                                        <div className="relative group">
                                                            <img 
                                                                src={venue.logo} 
                                                                alt="Logo" 
                                                                className="h-20 w-20 rounded-xl object-cover border border-neutral-200 shadow-sm"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setData('remove_logo', true)}
                                                                className="absolute -top-2 -right-2 bg-red-100 text-red-650 hover:bg-red-200 rounded-full p-1 border border-red-200 shadow-sm transition-colors"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center text-center">
                                                            <div className="h-10 w-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 mb-2">
                                                                <Building2 className="h-5 w-5" />
                                                            </div>
                                                            <span className="text-xs text-neutral-500 font-semibold mb-1">Upload Logo</span>
                                                            <span className="text-[10px] text-neutral-400">PNG, JPG up to 2MB</span>
                                                            <input 
                                                                type="file" 
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    if (e.target.files?.[0]) {
                                                                        setData({ ...data, logo: e.target.files[0], remove_logo: false });
                                                                    }
                                                                }}
                                                                className="mt-2 text-[10px] text-neutral-500 max-w-[150px] cursor-pointer"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <InputError message={errors.logo} />
                                            </div>

                                            {/* 2. GALLERY UPLOAD */}
                                            <div className="space-y-2.5 md:col-span-2">
                                                <Label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Gallery Photos</Label>
                                                <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 bg-white dark:bg-neutral-900/10 min-h-[140px] space-y-4">
                                                    {/* Existing gallery preview */}
                                                    {data.existing_gallery.length > 0 && (
                                                        <div className="flex flex-wrap gap-2.5">
                                                            {data.existing_gallery.map((imgUrl, idx) => (
                                                                <div key={idx} className="relative group">
                                                                    <img 
                                                                        src={imgUrl} 
                                                                        alt={`Gallery ${idx}`} 
                                                                        className="h-14 w-20 rounded-lg object-cover border border-neutral-200 shadow-sm"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const updated = data.existing_gallery.filter((_, i) => i !== idx);
                                                                            setData('existing_gallery', updated);
                                                                        }}
                                                                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    >
                                                                        <Trash2 className="h-2.5 w-2.5" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-100 dark:border-neutral-800/80 pt-3">
                                                        <div className="text-left">
                                                            <span className="text-xs text-neutral-500 font-semibold block">Add Gallery Photos</span>
                                                            <span className="text-[10px] text-neutral-400 block mt-0.5">Select one or more photos (max 4MB each)</span>
                                                        </div>
                                                        <input 
                                                            type="file" 
                                                            accept="image/*"
                                                            multiple
                                                            onChange={(e) => {
                                                                if (e.target.files) {
                                                                    const filesArray = Array.from(e.target.files);
                                                                    setData('gallery', filesArray);
                                                                }
                                                            }}
                                                            className="text-xs text-neutral-500 cursor-pointer max-w-[200px]"
                                                        />
                                                    </div>
                                                </div>
                                                <InputError message={errors.gallery} />
                                            </div>
                                        </div>

                                        {/* 3. PORTFOLIO UPLOAD */}
                                        <div className="space-y-2.5">
                                            <Label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Portfolio Photos</Label>
                                            <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 bg-white dark:bg-neutral-900/10 min-h-[140px] space-y-4">
                                                {/* Existing portfolio preview */}
                                                {data.existing_portfolio.length > 0 && (
                                                    <div className="flex flex-wrap gap-2.5">
                                                        {data.existing_portfolio.map((imgUrl, idx) => (
                                                            <div key={idx} className="relative group">
                                                                <img 
                                                                    src={imgUrl} 
                                                                    alt={`Portfolio ${idx}`} 
                                                                    className="h-14 w-20 rounded-lg object-cover border border-neutral-200 shadow-sm"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const updated = data.existing_portfolio.filter((_, i) => i !== idx);
                                                                        setData('existing_portfolio', updated);
                                                                    }}
                                                                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <Trash2 className="h-2.5 w-2.5" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-100 dark:border-neutral-800/80 pt-3">
                                                    <div className="text-left">
                                                        <span className="text-xs text-neutral-500 font-semibold block">Add Portfolio Photos</span>
                                                        <span className="text-[10px] text-neutral-400 block mt-0.5">Select one or more photos (max 4MB each)</span>
                                                    </div>
                                                    <input 
                                                        type="file" 
                                                        accept="image/*"
                                                        multiple
                                                        onChange={(e) => {
                                                            if (e.target.files) {
                                                                const filesArray = Array.from(e.target.files);
                                                                setData('portfolio', filesArray);
                                                            }
                                                        }}
                                                        className="text-xs text-neutral-500 cursor-pointer max-w-[200px]"
                                                    />
                                                </div>
                                            </div>
                                            <InputError message={errors.portfolio} />
                                        </div>
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

                                    <div className="space-y-3 border-t border-neutral-100 dark:border-neutral-800 pt-5">
                                        <div>
                                            <Label className="text-sm font-semibold">Font Style</Label>
                                            <span className="text-xs text-neutral-400 block mt-0.5">
                                                Choose the typography style for your public venue booking page.
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2.5">
                                            {[
                                                { id: 'sans', name: 'Inter (Modern Sans)' },
                                                { id: 'serif', name: 'Cormorant Garamond (Classic Serif)' },
                                                { id: 'mono', name: 'Space Mono (Technical)' },
                                            ].map((f) => (
                                                <button
                                                    key={f.id}
                                                    type="button"
                                                    onClick={() => setData('font', f.id)}
                                                    className={`h-9 items-center px-4 flex rounded-lg text-xs font-semibold border transition-all duration-200 ${
                                                        data.font === f.id
                                                            ? 'border-neutral-950 dark:border-white ring-2 ring-neutral-400 dark:ring-neutral-700'
                                                            : 'border-neutral-200 dark:border-neutral-800 opacity-80 hover:opacity-100'
                                                    }`}
                                                >
                                                    {f.name}
                                                </button>
                                            ))}
                                        </div>
                                        <InputError message={errors.font} />
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
