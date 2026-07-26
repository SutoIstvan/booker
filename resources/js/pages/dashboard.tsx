import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Building2, Scissors, Users, CalendarDays, ExternalLink, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
    const { auth } = usePage<{ auth: { user: { name: string } } }>().props;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6 max-w-6xl mx-auto">
                
                {/* Welcome Hero */}
                <div className="flex flex-col md:flex-row justify-between gap-4 p-6 rounded-2xl bg-neutral-900 text-white dark:bg-zinc-900 border border-neutral-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[240px] h-[240px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 space-y-1.5 text-left">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-yellow-400" />
                            Booking Platform
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-instrument-sans)" }}>
                            Welcome back, {auth.user.name}!
                        </h1>
                        <p className="text-sm text-neutral-400 max-w-lg">
                            Register your beauty salon, barbershop or service repair venue and start accepting appointments online.
                        </p>
                    </div>
                    <div className="flex items-end shrink-0 gap-2 mt-2 md:mt-0 relative z-10">
                        <Button asChild className="rounded-xl h-11 px-5 bg-white text-black hover:bg-neutral-200">
                            <Link href="/dashboard/venues/create">
                                <Plus className="mr-1.5 h-4 w-4" />
                                Add Venue
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Getting Started Guide */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 text-left">
                        Getting Started Guide
                    </h2>
                    
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                        <Card className="border-neutral-200 dark:border-neutral-800 text-left">
                            <CardHeader className="p-4 pb-2">
                                <div className="h-9 w-9 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-600 dark:text-neutral-300 mb-2">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-sm font-bold">1. Create a Venue</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    Add your business name, description, address and select a theme color.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-neutral-200 dark:border-neutral-800 text-left">
                            <CardHeader className="p-4 pb-2">
                                <div className="h-9 w-9 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-600 dark:text-neutral-300 mb-2">
                                    <Scissors className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-sm font-bold">2. Set up Services</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    Add treatment options, service duration, description and prices.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-neutral-200 dark:border-neutral-800 text-left">
                            <CardHeader className="p-4 pb-2">
                                <div className="h-9 w-9 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-600 dark:text-neutral-300 mb-2">
                                    <Users className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-sm font-bold">3. Add Specialists</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    Add profile pictures for your staff members and link services to them.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-neutral-200 dark:border-neutral-800 text-left">
                            <CardHeader className="p-4 pb-2">
                                <div className="h-9 w-9 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-600 dark:text-neutral-300 mb-2">
                                    <CalendarDays className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-sm font-bold">4. Share URL Link</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    Set up your open hours and share your custom link booking.app/your-slug.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Dashboard shortcuts */}
                <div className="grid gap-6 md:grid-cols-2 mt-2">
                    <Card className="border-neutral-200 dark:border-neutral-800 text-left flex flex-col justify-between">
                        <CardHeader className="p-5">
                            <CardTitle className="text-base">Configure Venues</CardTitle>
                            <CardDescription className="text-xs">
                                Setup and edit services, working hours, and see lists of employees.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-5 pt-0">
                            <Button asChild className="rounded-xl w-full h-10">
                                <Link href="/dashboard/venues">
                                    Go to My Venues
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-200 dark:border-neutral-800 text-left flex flex-col justify-between">
                        <CardHeader className="p-5">
                            <CardTitle className="text-base">How it works</CardTitle>
                            <CardDescription className="text-xs">
                                Clients open your page, choose service/staff, select time slot and receive notification.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-5 pt-0 space-y-2">
                            <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                <span>Dynamic slot calculation avoids double-booking</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                <span>No login required for booking clients</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};

