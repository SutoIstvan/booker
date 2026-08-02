import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import {
    Clock, MapPin, Star, Phone, Share2, Heart, Image, Mail,
    Leaf, HandHeart, ShieldCheck, Quote, ChevronLeft, ChevronRight, X, Flower2, Building2, Check, Info
} from 'lucide-react';
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
    font: string;
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

    // Get today's working hours description
    const getTodayWorkingHours = () => {
        const todayDayIndex = new Date().getDay();
        const hrs = venue.working_hours.find(h => h.day_of_week === todayDayIndex);
        if (!hrs) return 'Closed today';
        return hrs.is_day_off ? 'Closed today' : `Open today ${formatTime(hrs.open_time)}–${formatTime(hrs.close_time)}`;
    };

    const testimonials = [
        {
            name: 'Ольга К.',
            text: 'Лучший расслабляющий массаж в городе. Уходила как будто заново родилась. Атмосфера невероятно спокойная.',
        },
        {
            name: 'Дмитрий В.',
            text: 'Хожу на спортивный массаж после тренировок. Мастер профессиональный, спина перестала болеть. Рекомендую!',
        },
        {
            name: 'Мария С.',
            text: 'Ароматерапия — это что-то волшебное. Онлайн-запись удобная, всегда подтверждают заранее. Мой любимый салон.',
        },
    ];

    const features = [
        {
            icon: HandHeart,
            title: 'Опытные мастера',
            text: 'Сертифицированные специалисты со стажем от 5 лет и индивидуальным подходом.',
        },
        {
            icon: Leaf,
            title: 'Натуральные масла',
            text: 'Только органическая косметика и эфирные масла премиального качества.',
        },
        {
            icon: ShieldCheck,
            title: 'Чистота и комфорт',
            text: 'Стерильность, свежий текстиль к каждому сеансу и уютная атмосфера покоя.',
        },
    ];

    const fontMapping: Record<string, string> = {
        sans: "'Inter', ui-sans-serif, system-ui, sans-serif",
        serif: "'Cormorant Garamond', ui-serif, Georgia, serif",
        mono: "'Space Mono', ui-monospace, SFMono-Regular, Consolas, monospace",
    };
    const selectedFont = fontMapping[venue.font] || fontMapping.sans;

    return (
        <>
            <Head title={`${venue.name} - Online Booking`}>
                <meta name="description" content={venue.description || `Book your appointment online at ${venue.name}.`} />
            </Head>

            <div 
                className="theme-salon min-h-screen bg-background text-foreground antialiased selection:bg-primary/20"
                style={{
                    '--primary': venue.primary_color || 'oklch(0.52 0.055 145)',
                    '--ring': venue.primary_color || 'oklch(0.52 0.055 145)',
                    '--font-sans': selectedFont,
                    '--font-serif': selectedFont,
                } as React.CSSProperties}
            >
                {/* Site Header */}
                <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
                    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
                        <a href="#" className="flex items-center gap-2.5">
                            {venue.logo ? (
                                <img
                                    src={venue.logo}
                                    alt={venue.name}
                                    className="h-9 w-9 rounded-xl object-cover bg-card border border-border p-0.5 shadow-sm"
                                />
                            ) : (
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                                    <Flower2 className="h-5 w-5" aria-hidden="true" />
                                </span>
                            )}
                            <span className="font-serif text-xl font-semibold tracking-wide text-foreground">
                                {venue.name}
                            </span>
                        </a>

                        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
                            <a href="#services" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                                Услуги
                            </a>
                            <a href="#booking" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                                Запись
                            </a>
                            {venue.description && (
                                <a href="#about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                                    О салоне
                                </a>
                            )}
                            {venue.staff_members.length > 0 && (
                                <a href="#team" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                                    Команда
                                </a>
                            )}
                            <a href="#contacts" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                                Контакты
                            </a>
                        </nav>

                        <div className="flex items-center gap-2">
                            {/* Favorite Button */}
                            <button
                                onClick={handleToggleFavorite}
                                className={`flex items-center justify-center p-2.5 rounded-full border shadow-sm active:scale-[0.98] transition-all cursor-pointer ${isFavorite
                                    ? 'bg-rose-50 text-rose-500 border-rose-200/80 hover:bg-rose-100/50'
                                    : 'border-border bg-card text-muted-foreground hover:bg-secondary'
                                    }`}
                                title={isFavorite ? "В избранном" : "Добавить в избранное"}
                            >
                                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                            </button>

                            {/* Share Button */}
                            <button
                                onClick={handleShare}
                                className="flex items-center justify-center p-2.5 rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:bg-secondary active:scale-[0.98] transition-all cursor-pointer"
                                title="Поделиться"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>

                            <a
                                href="#booking"
                                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                            >
                                <Phone className="h-4 w-4" aria-hidden="true" />
                                Записаться
                            </a>
                        </div>
                    </div>
                </header>

                <main>
                    {/* Hero Section */}
                    <section className="relative overflow-hidden border-b border-border/40">
                        {/* Visual Ambient Glows */}
                        <div className="absolute top-0 inset-x-0 h-[500px] bg-[radial-gradient(ellipse_at_top,var(--primary)/4%,transparent)] pointer-events-none" />
                        <div className="absolute top-24 left-1/4 w-[300px] h-[300px] rounded-full blur-3xl pointer-events-none opacity-[0.04] bg-primary" />

                        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-12 md:px-6 md:py-24">
                            <div className="flex flex-col gap-6 text-left">
                                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-sm font-medium text-accent border border-accent/20">
                                    <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
                                    {venue.category || 'Booking page'}
                                </span>

                                <h1 className="text-balance font-serif text-4xl font-semibold leading-tight text-foreground md:text-6xl">
                                    {venue.name}
                                </h1>

                                <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
                                    {venue.description || 'Индивидуальные программы ухода и оздоровления в атмосфере абсолютного покоя. Опытные мастера, натуральная косметика и удобная онлайн-запись.'}
                                </p>

                                <div className="flex flex-wrap items-center gap-3">
                                    <a
                                        href="#booking"
                                        className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 shadow-sm"
                                    >
                                        Записаться онлайн
                                    </a>
                                    <a
                                        href="#services"
                                        className="inline-flex items-center justify-center rounded-full border border-border bg-card px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary shadow-sm"
                                    >
                                        Наши услуги
                                    </a>
                                </div>

                                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                                    <span className="inline-flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                                        {getTodayWorkingHours()}
                                    </span>
                                    {(venue.address || venue.city) && (
                                        <span className="inline-flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                                            {venue.address}{venue.address && venue.city && ', '}{venue.city}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="overflow-hidden rounded-3xl border border-border/60 shadow-sm aspect-[4/3] bg-card">
                                    <img
                                        src={uniqueImages[0] || '/images/hero-massage.png'}
                                        alt={venue.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-5 py-4 shadow-sm">
                                    <div className="flex items-center gap-1 text-accent">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
                                        ))}
                                    </div>
                                    <div className="text-sm text-left">
                                        <p className="font-semibold text-foreground">4.9 из 5</p>
                                        <p className="text-muted-foreground">128+ отзывов</p>
                                    </div>
                                </div>

                                {uniqueImages.length > 0 && (
                                    <button
                                        onClick={() => openLightbox(0)}
                                        className="absolute top-4 right-4 flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card/90 text-foreground text-xs font-semibold shadow-sm hover:bg-card active:scale-[0.98] transition-all cursor-pointer backdrop-blur-xs"
                                    >
                                        <Image className="w-3.5 h-3.5 text-primary" />
                                        <span>Смотреть галерею ({uniqueImages.length})</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Services Section */}
                    {venue.services.length > 0 && (
                        <section id="services" className="scroll-mt-20 py-16 md:py-24 border-b border-border/40">
                            <div className="mx-auto max-w-6xl px-4 md:px-6">
                                <div className="mx-auto mb-12 max-w-2xl text-center">
                                    <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
                                        Наши Услуги
                                    </p>
                                    <h2 className="text-balance font-serif text-3xl font-semibold text-foreground md:text-4xl">
                                        Уход и оздоровление тела и души
                                    </h2>
                                    <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                                        Выберите подходящую программу — каждый сеанс адаптируется под ваши индивидуальные пожелания и цели.
                                    </p>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {venue.services.map((service, idx) => {
                                        // Pick sequential placeholder images if no custom gallery, or use first image
                                        const cardImage = uniqueImages[idx % uniqueImages.length] ||
                                            (idx % 2 === 0 ? '/images/service-relax.png' : '/images/service-aroma.png');

                                        return (
                                            <article
                                                key={service.id}
                                                className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-shadow hover:shadow-md text-left"
                                            >
                                                <div className="aspect-[3/2] overflow-hidden bg-secondary/20">
                                                    <img
                                                        src={cardImage}
                                                        alt={service.name}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                                                        loading="lazy"
                                                    />
                                                </div>

                                                <div className="flex flex-1 flex-col gap-3 p-6">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                                                        {service.duration_minutes} мин
                                                    </div>
                                                    <h3 className="font-serif text-xl font-semibold text-foreground">
                                                        {service.name}
                                                    </h3>
                                                    <p className="flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                                                        {service.description || 'Нежное воздействие на body, способствующее снятию напряжения, восстановлению сил и расслаблению мышц.'}
                                                    </p>
                                                    <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-4">
                                                        <span className="text-lg font-semibold text-foreground">
                                                            ${(service.price / 100).toFixed(2)}
                                                        </span>
                                                        <a
                                                            href="#booking"
                                                            className="text-sm font-medium text-primary transition-colors hover:text-accent flex items-center gap-0.5"
                                                        >
                                                            Записаться →
                                                        </a>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Booking Section */}
                    <section id="booking" className="scroll-mt-20 bg-secondary/50 py-16 md:py-24 border-b border-border/40">
                        <div className="mx-auto max-w-6xl px-4 md:px-6">
                            <div className="mx-auto mb-12 max-w-2xl text-center">
                                <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
                                    Онлайн-запись
                                </p>
                                <h2 className="text-balance font-serif text-3xl font-semibold text-foreground md:text-4xl">
                                    Забронируйте удобное время
                                </h2>
                                <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                                    Выберите необходимую услугу, квалифицированного мастера и доступную дату — мы оперативно подтвердим ваш визит.
                                </p>
                            </div>

                            <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm p-6 md:p-10">
                                <VenueBookingWidget
                                    venue={venue}
                                    services={venue.services}
                                    staffMembers={venue.staff_members}
                                />
                            </div>
                        </div>
                    </section>

                    {/* About Section */}
                    {venue.description && (
                        <section id="about" className="scroll-mt-20 py-16 md:py-24 border-b border-border/40">
                            <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:gap-14 md:px-6">
                                <div className="overflow-hidden rounded-3xl border border-border/60 shadow-sm aspect-[4/3] bg-card">
                                    <img
                                        src={uniqueImages[1] || uniqueImages[0] || '/images/about-interior.png'}
                                        alt="Интерьер салона"
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div className="flex flex-col gap-6 text-left">
                                    <p className="text-sm font-medium uppercase tracking-widest text-primary">
                                        О салоне
                                    </p>
                                    <h2 className="text-balance font-serif text-3xl font-semibold text-foreground md:text-4xl">
                                        Пространство, где время замедляется
                                    </h2>
                                    <p className="text-pretty leading-relaxed text-muted-foreground text-sm md:text-base">
                                        {venue.description}
                                    </p>

                                    <div className="mt-2 flex flex-col gap-5">
                                        {features.map((f) => (
                                            <div key={f.title} className="flex gap-4">
                                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/10">
                                                    <f.icon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                                <div>
                                                    <h3 className="font-serif text-base font-semibold text-foreground">{f.title}</h3>
                                                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                                        {f.text}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Team Section */}
                    {venue.staff_members.length > 0 && (
                        <section id="team" className="scroll-mt-20 py-16 md:py-24 border-b border-border/40">
                            <div className="mx-auto max-w-6xl px-4 md:px-6">
                                <div className="mx-auto mb-12 max-w-2xl text-center">
                                    <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
                                        Наши специалисты
                                    </p>
                                    <h2 className="text-balance font-serif text-3xl font-semibold text-foreground md:text-4xl">
                                        Команда профессионалов
                                    </h2>
                                    <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                                        Сертифицированные мастера с многолетним стажем помогут вам обрести гармонию и почувствовать легкость.
                                    </p>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-center">
                                    {venue.staff_members.map((member) => (
                                        <div
                                            key={member.id}
                                            className="p-5 border border-border rounded-2xl bg-card flex flex-col items-center text-center gap-4 shadow-sm hover:border-primary/30 transition-all duration-200"
                                        >
                                            {member.avatar ? (
                                                <img
                                                    src={member.avatar}
                                                    alt={member.name}
                                                    className="h-20 w-20 rounded-full object-cover border-2 border-primary/20 p-0.5"
                                                />
                                            ) : (
                                                <div className="h-20 w-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-serif font-bold text-primary text-xl shadow-inner">
                                                    {member.name.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="space-y-1">
                                                <h4 className="font-serif text-lg font-semibold text-foreground">{member.name}</h4>
                                                <p className="text-muted-foreground text-xs">{member.position || 'Специалист'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Portfolio / Works Section */}
                    {venue.portfolio && venue.portfolio.length > 0 && (
                        <section className="py-16 md:py-24 border-b border-border/40">
                            <div className="mx-auto max-w-6xl px-4 md:px-6">
                                <div className="mx-auto mb-12 max-w-2xl text-center">
                                    <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
                                        Галерея работ
                                    </p>
                                    <h2 className="text-balance font-serif text-3xl font-semibold text-foreground md:text-4xl">
                                        Наше портфолио
                                    </h2>
                                </div>

                                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                                    {venue.portfolio.map((imgUrl, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => {
                                                const originalIdx = uniqueImages.indexOf(imgUrl);
                                                if (originalIdx !== -1) openLightbox(originalIdx);
                                            }}
                                            className="relative aspect-square rounded-2xl overflow-hidden border border-border bg-card shadow-sm cursor-pointer hover:opacity-95 transition-opacity"
                                        >
                                            <img
                                                src={imgUrl}
                                                alt={`Portfolio ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Testimonials Section */}
                    <section id="testimonials" className="scroll-mt-20 bg-secondary/50 py-16 md:py-24 border-b border-border/40">
                        <div className="mx-auto max-w-6xl px-4 md:px-6">
                            <div className="mx-auto mb-12 max-w-2xl text-center">
                                <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
                                    Отзывы
                                </p>
                                <h2 className="text-balance font-serif text-3xl font-semibold text-foreground md:text-4xl">
                                    Что говорят наши гости
                                </h2>
                            </div>

                            <div className="grid gap-6 md:grid-cols-3">
                                {testimonials.map((t) => (
                                    <figure
                                        key={t.name}
                                        className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 text-left"
                                    >
                                        <Quote className="h-7 w-7 text-primary/30" aria-hidden="true" />
                                        <blockquote className="flex-1 text-pretty leading-relaxed text-foreground text-sm">
                                            {t.text}
                                        </blockquote>
                                        <div className="flex items-center gap-1 text-accent">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
                                            ))}
                                        </div>
                                        <figcaption className="text-xs font-semibold text-muted-foreground">
                                            {t.name}
                                        </figcaption>
                                    </figure>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>

                {/* Site Footer */}
                <footer id="contacts" className="scroll-mt-20 border-t border-border/60 bg-background">
                    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3 md:px-6">
                        <div className="flex flex-col gap-4 text-left">
                            <div className="flex items-center gap-2.5">
                                {venue.logo ? (
                                    <img
                                        src={venue.logo}
                                        alt={venue.name}
                                        className="h-8 w-8 rounded-lg object-cover border border-border shadow-xs"
                                    />
                                ) : (
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                                        <Flower2 className="h-4.5 w-4.5" aria-hidden="true" />
                                    </span>
                                )}
                                <span className="font-serif text-lg font-semibold text-foreground">
                                    {venue.name}
                                </span>
                            </div>
                            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                                {venue.category || 'Салон массажа и SPA'}. Место, где вы можете позволить себе замедлиться и восстановить силы.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 text-left">
                            <h3 className="font-serif text-base font-semibold text-foreground">Контакты</h3>
                            {venue.phone && (
                                <a
                                    href={`tel:${venue.phone}`}
                                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
                                    {venue.phone}
                                </a>
                            )}
                            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                                {venue.address || 'Адрес не указан'}{venue.address && venue.city && ', '}{venue.city}
                            </span>
                        </div>

                        <div className="flex flex-col gap-3 text-left">
                            <h3 className="font-serif text-base font-semibold text-foreground">Часы работы</h3>
                            {venue.working_hours && venue.working_hours.length > 0 ? (
                                <div className="space-y-1">
                                    {DISPLAY_ORDER.map((dayIndex) => {
                                        const hrs = venue.working_hours.find(h => h.day_of_week === dayIndex);
                                        if (!hrs) return null;

                                        return (
                                            <div key={dayIndex} className="flex justify-between max-w-[240px] text-xs text-muted-foreground">
                                                <span>{DAY_NAMES[dayIndex]}</span>
                                                {hrs.is_day_off ? (
                                                    <span className="italic opacity-60">Closed</span>
                                                ) : (
                                                    <span className="font-medium text-foreground">
                                                        {formatTime(hrs.open_time)} - {formatTime(hrs.close_time)}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                                    Режим работы не указан
                                </span>
                            )}
                            <a
                                href="#booking"
                                className="mt-2 inline-flex w-fit items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 shadow-sm"
                            >
                                Записаться онлайн
                            </a>
                        </div>
                    </div>

                    <div className="border-t border-border/60 py-6 text-center text-sm text-muted-foreground">
                        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 md:px-6">
                            <span>© {new Date().getFullYear()} {venue.name}. Все права защищены.</span>
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
                                <Check className="w-4 h-4 text-primary" />
                                Страница онлайн-записи
                            </span>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-between p-4 md:p-8 animate-in fade-in duration-200">
                    {/* Header: Close Button and Counter */}
                    <div className="w-full flex items-center justify-between text-white max-w-5xl">
                        <span className="text-sm font-medium text-zinc-400 font-serif">
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
