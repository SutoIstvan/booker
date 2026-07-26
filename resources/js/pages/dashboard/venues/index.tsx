import { Head, Link } from '@inertiajs/react';
import { Building2, ExternalLink, Plus, Phone, MapPin, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BreadcrumbItem } from '@/types';

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
    bookings_count?: number;
}

interface Props {
    venues: Venue[];
}

export default function VenuesIndex({ venues }: Props) {
    return (
        <>
            <Head title="My Venues" />

            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">My Venues</h1>
                        <p className="text-neutral-500 dark:text-neutral-400">
                            Manage your business venues, schedules, and view client bookings.
                        </p>
                    </div>
                    <Button asChild className="shimmer-btn bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 rounded-xl h-11 px-5">
                        <Link href="/dashboard/venues/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Venue
                        </Link>
                    </Button>
                </div>

                {venues.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center border-dashed p-12 text-center border-neutral-200 dark:border-neutral-800">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900 text-neutral-400 mb-4">
                            <Building2 className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">No venues yet</h3>
                        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
                            Create your first venue (e.g. massage salon, barbershop) to start accepting client bookings online.
                        </p>
                        <Button asChild className="mt-6 rounded-xl">
                            <Link href="/dashboard/venues/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Venue
                            </Link>
                        </Button>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {venues.map((venue) => (
                            <Card key={venue.id} className="overflow-hidden flex flex-col justify-between border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-all duration-300">
                                <div>
                                    <div className="relative h-32 w-full bg-neutral-100 dark:bg-neutral-900">
                                        {venue.cover_image ? (
                                            <img
                                                src={venue.cover_image}
                                                alt={venue.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-zinc-900 via-neutral-900 to-zinc-900">
                                                <Building2 className="h-10 w-10 text-neutral-700" />
                                            </div>
                                        )}
                                        <Badge
                                            variant="secondary"
                                            className="absolute right-3 top-3 rounded-full bg-black/60 backdrop-blur-md text-white border-none"
                                        >
                                            {venue.category || 'General'}
                                        </Badge>
                                    </div>

                                    <CardHeader className="p-5">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <CardTitle className="text-xl font-bold line-clamp-1 text-neutral-900 dark:text-neutral-50">
                                                    {venue.name}
                                                </CardTitle>
                                                <CardDescription className="mt-1 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
                                                    {venue.description || 'No description provided.'}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="px-5 pb-5 pt-0 text-sm space-y-2.5 text-neutral-600 dark:text-neutral-400">
                                        {venue.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-neutral-400" />
                                                <span>{venue.phone}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-neutral-400" />
                                            <span className="line-clamp-1">
                                                {venue.address ? `${venue.address}, ${venue.city || ''}` : 'No address set'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-neutral-400" />
                                            <span>{venue.bookings_count ?? 0} bookings total</span>
                                        </div>
                                    </CardContent>
                                </div>

                                <div className="border-t border-neutral-100 dark:border-neutral-800 p-4 bg-neutral-50/50 dark:bg-neutral-900/20 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-1.5 text-xs">
                                        {venue.is_active ? (
                                            <>
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                <span className="text-emerald-600 dark:text-emerald-500 font-medium">Active</span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="h-4 w-4 text-neutral-400" />
                                                <span className="text-neutral-500 font-medium">Inactive</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button asChild variant="outline" size="sm" className="rounded-lg h-9">
                                            <a href={`/${venue.slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                                                Visit page
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </Button>
                                        <Button asChild size="sm" className="rounded-lg h-9">
                                            <Link href={`/dashboard/venues/${venue.id}/edit`}>
                                                Manage
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Venues',
        href: '/dashboard/venues',
    },
];

// Also export layout config property for template resolver
VenuesIndex.layout = {
    breadcrumbs,
};
