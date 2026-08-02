import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import type { BreadcrumbItem } from '@/types';
import { useEffect } from 'react';

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

export default function VenueCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        category: 'Barbershop',
        phone: '',
        address: '',
        city: '',
        primary_color: '#18181b',
        font: 'sans',
    });

    // Automatically generate slug from name
    useEffect(() => {
        const slug = data.name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // remove non-word chars
            .replace(/[\s_-]+/g, '-') // swap spaces/underscores for single dash
            .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes
        setData('slug', slug);
    }, [data.name]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/venues');
    };

    return (
        <>
            <Head title="Create Venue" />

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" size="icon" className="rounded-full h-9 w-9">
                        <Link href="/dashboard/venues">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Create New Venue</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Set up a new booking page for your shop, salon or business.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="border-neutral-200 dark:border-neutral-800">
                        <CardHeader>
                            <CardTitle className="text-lg">Venue Details</CardTitle>
                            <CardDescription>
                                Tell clients about your venue and customize its page appearance.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name">Venue Name</Label>
                                    <Input
                                        id="name"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Gentlemens Cut"
                                        className="rounded-xl border-neutral-200 dark:border-neutral-800 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-300"
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
                                            placeholder="gentlemens-cut"
                                            className="rounded-r-xl rounded-l-none border-neutral-200 dark:border-neutral-800 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-300"
                                        />
                                    </div>
                                    <span className="text-[11px] text-neutral-400">Letters, numbers and dashes only.</span>
                                    <InputError message={errors.slug} />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="category">Business Category</Label>
                                    <Select
                                        value={data.category}
                                        onValueChange={(val) => setData('category', val)}
                                    >
                                        <SelectTrigger className="rounded-xl border-neutral-200 dark:border-neutral-800 focus:ring-neutral-950 dark:focus:ring-neutral-300">
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
                                        placeholder="e.g. +1 (555) 000-0000"
                                        className="rounded-xl border-neutral-200 dark:border-neutral-800 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-300"
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
                                        placeholder="e.g. 123 Main St"
                                        className="rounded-xl border-neutral-200 dark:border-neutral-800 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-300"
                                    />
                                    <InputError message={errors.address} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        placeholder="e.g. New York"
                                        className="rounded-xl border-neutral-200 dark:border-neutral-800 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-300"
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
                                    placeholder="Write a brief overview about your business services and specialists..."
                                    className="rounded-xl border-neutral-200 dark:border-neutral-800 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-300"
                                />
                                <InputError message={errors.description} />
                            </div>

                            {/* Color Selector */}
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

                    <div className="flex justify-end gap-3 mt-6">
                        <Button asChild variant="outline" className="rounded-xl h-11 px-5 border-neutral-200 dark:border-neutral-800">
                            <Link href="/dashboard/venues">Cancel</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="shimmer-btn bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 rounded-xl h-11 px-5"
                        >
                            {processing ? 'Creating...' : 'Create & Configure'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

VenueCreate.layout = {
    breadcrumbs: [
        { title: 'Venues', href: '/dashboard/venues' },
        { title: 'Create', href: '/dashboard/venues/create' },
    ],
};
