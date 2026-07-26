import { Head, Link } from '@inertiajs/react';
import { Calendar, CheckCircle2, ChevronLeft, Info, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

interface Service {
    name: string;
}

interface Venue {
    name: string;
    slug: string;
}

interface Booking {
    client_name: string;
    booking_date: string;
    start_time: string;
    venue: Venue;
    service: Service;
}

interface Props {
    booking: Booking;
}

export default function BookingCancelled({ booking }: Props) {
    const dateFormatted = format(new Date(booking.booking_date), 'eeee, MMMM dd, yyyy');
    
    const formatTime = (time24: string) => {
        const [h, m] = time24.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${displayHour}:${m} ${ampm}`;
    };

    return (
        <>
            <Head title="Booking Cancelled" />
            <main className="min-h-screen bg-zinc-950 text-white selection:bg-zinc-800 selection:text-white flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(24,24,27,0.8),rgba(9,9,11,1))]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-950/10 rounded-full blur-3xl pointer-events-none" />

                <div className="w-full max-w-md relative z-10 space-y-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/5">
                            <Info className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-instrument-sans)" }}>
                            Booking Cancelled
                        </h1>
                        <p className="text-zinc-400 text-sm">
                            Your appointment has been successfully cancelled.
                        </p>
                    </div>

                    <Card className="border-zinc-800 bg-zinc-900/30 backdrop-blur-xl rounded-2xl overflow-hidden text-left shadow-inner">
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <span className="text-xs text-zinc-500 block uppercase tracking-wider font-bold">Venue</span>
                                <span className="text-base font-semibold text-zinc-200">{booking.venue.name}</span>
                            </div>

                            <div>
                                <span className="text-xs text-zinc-500 block uppercase tracking-wider font-bold">Service</span>
                                <span className="text-base font-semibold text-zinc-200">{booking.service.name}</span>
                            </div>

                            <div>
                                <span className="text-xs text-zinc-500 block uppercase tracking-wider font-bold">Scheduled Time</span>
                                <span className="text-sm font-semibold text-zinc-200 block mt-0.5">{dateFormatted}</span>
                                <span className="text-xs text-zinc-400 block mt-0.5">{formatTime(booking.start_time)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-center space-y-4">
                        <Button asChild className="w-full rounded-xl h-12 bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-sm">
                            <Link href={`/${booking.venue.slug}`}>
                                Book Another Appointment
                            </Link>
                        </Button>
                        
                        <Button asChild variant="link" className="text-zinc-400 hover:text-white transition-colors gap-1 justify-center inline-flex">
                            <Link href="/">
                                <ChevronLeft className="w-4 h-4" />
                                Go to homepage
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
        </>
    );
}
