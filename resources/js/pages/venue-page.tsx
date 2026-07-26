import { Head } from '@inertiajs/react';
import { Building2, Phone, MapPin, Check, Info, ShieldCheck } from 'lucide-react';
import VenueBookingWidget from '@/components/venue-booking-widget';

interface Service {
    id: number;
    name: string;
    description: string | null;
    duration_minutes: number;
    price: number;
}

interface StaffMember {
    id: number;
    name: string;
    avatar: string | null;
    position: string | null;
    services?: Service[];
}

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
    services: Service[];
    staff_members: StaffMember[];
    working_hours: WorkingHour[];
}

interface Props {
    venue: Venue;
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

const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function PublicVenuePage({ venue }: Props) {
    const pColor = venue.primary_color || '#18181b';

    const formatTime = (timeStr: string) => {
        try {
            const [h, m] = timeStr.split(':');
            const hour = parseInt(h);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 === 0 ? 12 : hour % 12;
            return `${displayHour}:${m} ${ampm}`;
        } catch (e) {
            return timeStr;
        }
    };

    return (
        <>
            <Head title={`${venue.name} - Online Booking`}>
                <meta name="description" content={venue.description || `Book your appointment online at ${venue.name}.`} />
            </Head>

            <main className="min-h-screen bg-zinc-50/70 text-zinc-900 selection:bg-zinc-200 selection:text-zinc-900 pb-16">
                {/* Visual Ambient Glows */}
                <div className="absolute top-0 inset-x-0 h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.015),transparent)] pointer-events-none" />
                <div
                    className="absolute top-24 left-1/4 w-[300px] h-[300px] rounded-full blur-3xl pointer-events-none opacity-[0.04]"
                    style={{ backgroundColor: pColor }}
                />

                {/* Banner / Cover */}
                <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-zinc-100 border-b border-zinc-200/80">
                    {venue.cover_image ? (
                        <img
                            src={venue.cover_image}
                            alt={venue.name}
                            className="h-full w-full object-cover opacity-80"
                        />
                    ) : (
                        <div
                            className="h-full w-full opacity-40 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200"
                            style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${pColor}1A, transparent)` }}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-zinc-50/10 to-transparent" />

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl px-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {venue.logo ? (
                                <img
                                    src={venue.logo}
                                    alt={venue.name}
                                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover bg-white border border-zinc-200/80 p-1 shadow-sm"
                                />
                            ) : (
                                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center font-extrabold text-zinc-700 shrink-0 text-2xl shadow-sm">
                                    {venue.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="text-left space-y-1">
                                <span
                                    className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider text-zinc-600 border bg-white shadow-sm"
                                    style={{ borderColor: pColor + '33' }}
                                >
                                    {venue.category || 'Booking page'}
                                </span>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight leading-tight mt-1">
                                    {venue.name}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="max-w-5xl mx-auto px-4 mt-8 space-y-12">

                    {/* Booking Widget: Centered Full-Width Row ("в целый ряд") */}
                    <div className="w-full">
                        <VenueBookingWidget
                            venue={venue}
                            services={venue.services}
                            staffMembers={venue.staff_members}
                        />
                    </div>

                    {/* Information Grid: Two Columns below the widget */}
                    <div className="grid gap-8 md:grid-cols-2 pt-8 border-t border-zinc-200">
                        {/* Column 1: About Us & Team */}
                        <div className="space-y-8 text-left">
                            {venue.description && (
                                <section className="space-y-3">
                                    <h3 className="text-lg font-bold text-zinc-900 tracking-tight">About us</h3>
                                    <p className="text-zinc-600 text-sm leading-relaxed">{venue.description}</p>
                                </section>
                            )}

                            {venue.staff_members.length > 0 && (
                                <section className="space-y-4">
                                    <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Our Team</h3>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {venue.staff_members.map((member) => (
                                            <div key={member.id} className="p-3.5 border border-zinc-200 rounded-2xl bg-white flex items-center gap-3 shadow-sm hover:border-zinc-300 transition-colors duration-200">
                                                {member.avatar ? (
                                                    <img src={member.avatar} alt={member.name} className="h-10 w-10 rounded-full object-cover border border-zinc-100" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-500 text-xs">
                                                        {member.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="font-bold text-sm text-zinc-800">{member.name}</h4>
                                                    <p className="text-zinc-500 text-xs">{member.position || 'Specialist'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Column 2: Contact Details & Working Hours */}
                        <div className="space-y-8 text-left">
                            <section className="space-y-3">
                                <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Contact & Location</h3>
                                <div className="space-y-2.5 text-zinc-600 text-sm">
                                    {venue.address && (
                                        <div className="flex items-start gap-2.5">
                                            <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                                            <span>{venue.address}, {venue.city}</span>
                                        </div>
                                    )}
                                    {venue.phone && (
                                        <div className="flex items-center gap-2.5">
                                            <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                                            <span>{venue.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Working Hours</h3>
                                <div className="space-y-1.5 text-xs text-zinc-600">
                                    {DISPLAY_ORDER.map((dayIndex) => {
                                        const hrs = venue.working_hours.find(h => h.day_of_week === dayIndex);
                                        if (!hrs) return null;

                                        return (
                                            <div key={dayIndex} className="flex justify-between max-w-[280px]">
                                                <span className="font-medium text-zinc-400">{DAY_NAMES[dayIndex]}</span>
                                                {hrs.is_day_off ? (
                                                    <span className="text-zinc-400 italic">Closed</span>
                                                ) : (
                                                    <span className="text-zinc-700 font-semibold">
                                                        {formatTime(hrs.open_time)} - {formatTime(hrs.close_time)}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Gallery Section */}
                    {venue.gallery && venue.gallery.length > 0 && (
                        <section className="space-y-4 pt-8 border-t border-zinc-200 text-left">
                            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Gallery</h3>
                            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                                {venue.gallery.map((imgUrl, idx) => (
                                    <div key={idx} className="relative aspect-video sm:aspect-square rounded-2xl overflow-hidden border border-zinc-200/80 bg-zinc-100 shadow-sm hover:opacity-95 transition-opacity">
                                        <img
                                            src={imgUrl}
                                            alt={`Gallery ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Portfolio Section */}
                    {venue.portfolio && venue.portfolio.length > 0 && (
                        <section className="space-y-4 pt-8 border-t border-zinc-200 text-left">
                            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Portfolio & Works</h3>
                            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                                {venue.portfolio.map((imgUrl, idx) => (
                                    <div key={idx} className="relative aspect-video sm:aspect-square rounded-2xl overflow-hidden border border-zinc-200/80 bg-zinc-100 shadow-sm hover:opacity-95 transition-opacity">
                                        <img
                                            src={imgUrl}
                                            alt={`Portfolio ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <div className="border-t border-zinc-200 pt-6 flex items-center gap-2 text-zinc-400 text-xs text-left">
                        <ShieldCheck className="w-4 h-4 text-zinc-400" />
                        <span>Secured booking page. Confirmation details sent to your email.</span>
                    </div>

                </div>
            </main>
        </>
    );
}
