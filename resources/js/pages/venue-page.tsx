import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Building2, Phone, MapPin, Check, Info, ShieldCheck, Image, Share2, Heart, X, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import VenueBookingWidget from '@/components/venue-booking-widget';
import { toast } from 'sonner';

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

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImgIdx, setCurrentImgIdx] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    // Combine all available images: cover_image, gallery, and portfolio
    const rawImages = [
        ...(venue.cover_image ? [venue.cover_image] : []),
        ...(venue.gallery || []),
        ...(venue.portfolio || []),
    ];

    // Deduplicate images
    const uniqueImages = Array.from(new Set(rawImages));

    useEffect(() => {
        try {
            const favorites = JSON.parse(localStorage.getItem('favorites_venues') || '[]');
            setIsFavorite(favorites.includes(venue.id));
        } catch (e) { }
    }, [venue.id]);

    const handleToggleFavorite = () => {
        try {
            const favorites = JSON.parse(localStorage.getItem('favorites_venues') || '[]');
            let newFavorites;
            if (isFavorite) {
                newFavorites = favorites.filter((id: number) => id !== venue.id);
                toast.success('Компания удалена из избранного');
            } else {
                newFavorites = [...favorites, venue.id];
                toast.success('Компания добавлена в избранное!');
            }
            localStorage.setItem('favorites_venues', JSON.stringify(newFavorites));
            setIsFavorite(!isFavorite);
        } catch (e) {
            setIsFavorite(!isFavorite);
        }
    };

    const handleShare = () => {
        try {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Ссылка скопирована в буфер обмена!');
        } catch (e) {
            toast.error('Не удалось скопировать ссылку.');
        }
    };

    const openLightbox = (index: number) => {
        setCurrentImgIdx(index);
        setLightboxOpen(true);
    };

    const nextImage = () => {
        setCurrentImgIdx((prev) => (prev + 1) % uniqueImages.length);
    };

    const prevImage = () => {
        setCurrentImgIdx((prev) => (prev - 1 + uniqueImages.length) % uniqueImages.length);
    };

    useEffect(() => {
        if (!lightboxOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextImage();
            else if (e.key === 'ArrowLeft') prevImage();
            else if (e.key === 'Escape') setLightboxOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, uniqueImages.length]);

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

    // Split unique images into columns (max 5 columns, max 2 rows/images per column, up to 10 images total)
    const colsCount = Math.min(5, uniqueImages.length);
    const columns: string[][] = Array.from({ length: colsCount }, () => []);
    uniqueImages.slice(0, colsCount * 2).forEach((img, idx) => {
        columns[idx % colsCount].push(img);
    });

    const getGridColsClass = () => {
        if (colsCount === 1) return 'grid-cols-1';
        if (colsCount === 2) return 'grid-cols-2';
        if (colsCount === 3) return 'grid-cols-2 sm:grid-cols-3';
        if (colsCount === 4) return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
    };

    // Deterministic height classes mapping for a neat masonry look
    const getImgHeightClass = (colIdx: number, imgIdx: number) => {
        const heights = [
            ['h-24 sm:h-28', 'h-36 sm:h-44', 'h-28 sm:h-36'],
            ['h-40 sm:h-48', 'h-20 sm:h-28', 'h-32 sm:h-40'],
            ['h-28 sm:h-36', 'h-32 sm:h-40', 'h-40 sm:h-48'],
            ['h-36 sm:h-44', 'h-28 sm:h-36', 'h-20 sm:h-28'],
            ['h-32 sm:h-40', 'h-40 sm:h-48', 'h-24 sm:h-32'],
        ];
        return heights[colIdx % 5][imgIdx % 3];
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

                {/* Banner / Cover with Masonry Background */}
                <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-zinc-100 border-b border-zinc-200/80">
                    {uniqueImages.length > 0 ? (
                        /* Masonry Image Grid */
                        <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
                            <div className={`grid ${getGridColsClass()} gap-2.5 p-2.5 h-full opacity-100 transition-opacity duration-300`}>
                                {columns.map((colImages, colIdx) => (
                                    <div
                                        key={colIdx}
                                        className={`flex flex-col gap-2.5 ${colIdx === 2 ? 'hidden sm:flex' :
                                            colIdx === 3 ? 'hidden md:flex' :
                                                colIdx === 4 ? 'hidden lg:flex' : ''
                                            }`}
                                    >
                                        {colImages.map((img, imgIdx) => {
                                            const originalIdx = uniqueImages.indexOf(img);
                                            return (
                                                <div
                                                    key={imgIdx}
                                                    onClick={() => openLightbox(originalIdx)}
                                                    className={`w-full overflow-hidden rounded-xl border border-zinc-200/30 bg-zinc-50 shadow-inner cursor-pointer ${getImgHeightClass(colIdx, imgIdx)}`}
                                                >
                                                    <img
                                                        src={img}
                                                        alt=""
                                                        className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-500 ease-out"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Default ambient background when no images exist */
                        <div
                            className="h-full w-full opacity-40 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200"
                            style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${pColor}1A, transparent)` }}
                        />
                    )}

                    {/* Radial Brand Glow Overlay for Bespoke Brand Association */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.07]"
                        style={{
                            backgroundImage: `radial-gradient(circle at 50% 30%, ${pColor}, transparent)`,
                        }}
                    />

                    {/* Clean Gradient fade at bottom to integrate seamlessly with main content and improve text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-zinc-70/100 to-transparent pointer-events-none" />

                    {/* Banner Contents: Logo, Title, and Category */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl px-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-10">
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

                        {/* Action Buttons in bottom-right of header */}
                        <div className="flex items-center gap-2 shrink-0">
                            {/* 1. Смотреть все фото */}
                            {uniqueImages.length > 0 && (
                                <button
                                    onClick={() => openLightbox(0)}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200/80 bg-white/95 text-zinc-700 text-xs font-bold shadow-sm hover:bg-zinc-50 active:scale-[0.98] transition-all cursor-pointer"
                                >
                                    <Image className="w-3.5 h-3.5 text-zinc-500" />
                                    <span>Смотреть все фото</span>
                                </button>
                            )}
                            {/* 2. Поделиться */}
                            <button
                                onClick={handleShare}
                                className="flex items-center justify-center p-2 rounded-xl border border-zinc-200/80 bg-white/95 text-zinc-700 shadow-sm hover:bg-zinc-50 active:scale-[0.98] transition-all cursor-pointer"
                                title="Поделиться"
                            >
                                <Share2 className="w-4 h-4 text-zinc-500" />
                            </button>
                            {/* 3. Сердечко - избранное */}
                            <button
                                onClick={handleToggleFavorite}
                                className={`flex items-center justify-center p-2 rounded-xl border shadow-sm active:scale-[0.98] transition-all cursor-pointer ${isFavorite
                                    ? 'bg-rose-50 text-rose-500 border-rose-200/80 hover:bg-rose-100/50'
                                    : 'border-zinc-200/80 bg-white/95 text-zinc-700 hover:bg-zinc-50'
                                    }`}
                                title={isFavorite ? "В избранном" : "Добавить в избранное"}
                            >
                                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-zinc-500'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="max-w-5xl mx-auto px-4 mt-8 space-y-8">
                    {/* Venue Quick Info Bar: Ratings, Address, Phone */}
                    <div className="flex flex-wrap items-center justify-start gap-y-2.5 gap-x-6 text-sm text-zinc-500 py-1">
                        {/* 1. Star Rating */}
                        <div className="flex items-center gap-1.5 sm:border-r sm:border-zinc-200/80 sm:pr-6 last:border-0 last:pr-0">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <span className="font-bold text-zinc-800">4.9</span>
                            <span className="text-zinc-400 text-xs">(128 отзывов)</span>
                        </div>

                        {/* 2. Address */}
                        {(venue.address || venue.city) && (
                            <div className="flex items-center gap-2 md:border-r md:border-zinc-200/80 md:pr-6 last:border-0 last:pr-0">
                                <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                                <span className="text-zinc-700">
                                    {venue.address}{venue.address && venue.city && ', '}{venue.city}
                                </span>
                            </div>
                        )}

                        {/* 3. Phone */}
                        {venue.phone && (
                            <div className="flex items-center gap-2 pr-6 last:border-0 last:pr-0">
                                <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                                <a href={`tel:${venue.phone}`} className="text-zinc-700 hover:text-zinc-950 transition-colors font-medium">
                                    {venue.phone}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Booking Widget: Centered Full-Width Row ("в целый ряд") */}
                    <div className="w-full">
                        <VenueBookingWidget
                            venue={venue}
                            services={venue.services}
                            staffMembers={venue.staff_members}
                        />
                    </div>


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


                    {/* Portfolio Section */}
                    {venue.portfolio && venue.portfolio.length > 0 && (
                        <section className="space-y-4 pt-8 text-left">
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


                        </div>





                        {/* Column 2: Contact Details & Working Hours */}
                        <div className="space-y-8 text-left">


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




                    <div className="border-t border-zinc-200 pt-6 flex items-center gap-2 text-zinc-400 text-xs text-left">
                        <ShieldCheck className="w-4 h-4 text-zinc-400" />
                        <span>Secured booking page. Confirmation details sent to your email.</span>
                    </div>

                </div>
            </main>

            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-between p-4 md:p-8 animate-in fade-in duration-200">
                    {/* Header: Close Button and Counter */}
                    <div className="w-full flex items-center justify-between text-white max-w-5xl">
                        <span className="text-sm font-medium text-zinc-400">
                            {currentImgIdx + 1} / {uniqueImages.length}
                        </span>
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Image and Arrows */}
                    <div className="relative w-full max-w-5xl flex-1 flex items-center justify-between gap-4 py-4">
                        <button
                            onClick={prevImage}
                            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                            title="Предыдущее фото"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <div className="relative flex-1 h-full flex items-center justify-center">
                            <img
                                src={uniqueImages[currentImgIdx]}
                                alt={`Photo ${currentImgIdx + 1}`}
                                className="max-w-full max-h-[70vh] md:max-h-[80vh] object-contain rounded-lg shadow-2xl select-none"
                            />
                        </div>

                        <button
                            onClick={nextImage}
                            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                            title="Следующее фото"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Bottom: Thumbnail Strip (if more than 1 image) */}
                    {uniqueImages.length > 1 && (
                        <div className="w-full max-w-2xl overflow-x-auto flex items-center justify-center gap-2 py-2">
                            {uniqueImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImgIdx(idx)}
                                    className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${idx === currentImgIdx ? 'border-white scale-105' : 'border-transparent opacity-50 hover:opacity-80'
                                        }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
