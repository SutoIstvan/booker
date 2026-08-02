import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle2, Globe, Calendar as CalendarIcon, ArrowRight, User, Mail, Phone, ChevronLeft, Loader2, DollarSign } from "lucide-react";
import { format, isSameDay } from "date-fns";
import InputError from '@/components/input-error';

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

interface Venue {
    id: number;
    name: string;
    slug: string;
    primary_color: string;
}

interface Props {
    venue: Venue;
    services: Service[];
    staffMembers: StaffMember[];
}

export default function VenueBookingWidget({ venue, services, staffMembers }: Props) {
    const { bookingSuccess } = usePage().props as { bookingSuccess?: any };

    const [step, setStep] = useState<"service" | "staff" | "datetime" | "details" | "success">("service");
    
    // Selection state
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ time_24: string; time_12: string } | null>(null);

    // Slots state
    const [slots, setSlots] = useState<{ time_24: string; time_12: string }[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Form setup using Inertia
    const form = useForm({
        service_id: "",
        staff_member_id: "" as string | number,
        client_name: "",
        client_email: "",
        client_phone: "",
        booking_date: "",
        start_time: "",
        notes: "",
    });

    // Handle date slider initialization
    useEffect(() => {
        setSelectedDate(new Date());
    }, []);

    // Monitor Inertia's bookingSuccess prop to transition to success slide
    useEffect(() => {
        if (bookingSuccess) {
            setStep("success");
        }
    }, [bookingSuccess]);

    // Next 14 days horizontal slider
    const dates = Array.from({ length: 14 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });

    // Filter staff members based on selected service
    const eligibleStaff = staffMembers.filter((staff) => {
        if (!selectedService) return true;
        return staff.services?.some((s) => s.id === selectedService.id) ?? false;
    });

    // Fetch slots when date, service or staff changes
    useEffect(() => {
        if (!selectedService || !selectedDate) return;

        const dateStr = format(selectedDate, "yyyy-MM-dd");
        setLoadingSlots(true);
        setSelectedTimeSlot(null);

        const url = `/${venue.slug}/available-slots?service_id=${selectedService.id}&date=${dateStr}${
            selectedStaff ? `&staff_member_id=${selectedStaff.id}` : ""
        }`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setSlots(data.slots || []);
                setLoadingSlots(false);
            })
            .catch(() => {
                setSlots([]);
                setLoadingSlots(false);
            });
    }, [selectedService, selectedStaff, selectedDate]);

    const handleServiceSelect = (service: Service) => {
        setSelectedService(service);
        form.setData("service_id", service.id.toString());
        
        // Reset subsequent selections
        setSelectedStaff(null);
        form.setData("staff_member_id", "");
        setSelectedTimeSlot(null);

        setStep("staff");
    };

    const handleStaffSelect = (staff: StaffMember | null) => {
        setSelectedStaff(staff);
        form.setData("staff_member_id", staff ? staff.id.toString() : "");
        setSelectedTimeSlot(null);
        setStep("datetime");
    };

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        setSelectedTimeSlot(null);
    };

    const handleTimeSelect = (slot: { time_24: string; time_12: string }) => {
        setSelectedTimeSlot(slot);
        form.setData({
            ...form.data,
            booking_date: format(selectedDate!, "yyyy-MM-dd"),
            start_time: slot.time_24,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(`/${venue.slug}/book`, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const pColor = venue.primary_color || "#18181b";

    return (
        <Card className="border-none bg-transparent shadow-none overflow-visible rounded-none">
            <CardContent className="p-0">
                <AnimatePresence mode="wait">
                    
                    {/* STEP 1: SELECT SERVICE */}
                    {step === "service" && (
                        <motion.div
                            key="service"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="space-y-6"
                        >
                            <div className="text-left">
                                <h3 className="font-serif text-2xl font-semibold text-foreground mb-1">Select Service</h3>
                                <p className="text-muted-foreground text-sm">Choose the treatment or service you would like to book.</p>
                            </div>

                            <div className="grid gap-3.5 max-h-[380px] overflow-y-auto pr-1">
                                {services.map((service) => (
                                    <button
                                        key={service.id}
                                        onClick={() => handleServiceSelect(service)}
                                        className="text-left w-full p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:bg-secondary/20 transition-all duration-300 group flex items-center justify-between gap-4 shadow-sm"
                                    >
                                        <div className="space-y-1">
                                            <h4 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                                {service.name}
                                            </h4>
                                            {service.description && (
                                                <p className="text-muted-foreground text-sm line-clamp-1">{service.description}</p>
                                            )}
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium pt-1">
                                                <Clock className="w-3.5 h-3.5 text-primary" />
                                                <span>{service.duration_minutes} min</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-semibold text-foreground">
                                                ${(service.price / 100).toFixed(2)}
                                            </span>
                                            <div className="text-xs text-primary font-medium uppercase tracking-wider mt-1 group-hover:opacity-80 flex items-center gap-0.5 justify-end">
                                                Select <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: SELECT STAFF MEMBER */}
                    {step === "staff" && selectedService && (
                        <motion.div
                            key="staff"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="space-y-6 text-left"
                        >
                            <button
                                onClick={() => setStep("service")}
                                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                Back to services
                            </button>

                            <div>
                                <h3 className="font-serif text-2xl font-semibold text-foreground mb-1">Select Professional</h3>
                                <p className="text-muted-foreground text-sm">Pick an available specialist or select any available.</p>
                            </div>

                            <div className="grid gap-3 max-h-[380px] overflow-y-auto">
                                {/* Any Available Option */}
                                <button
                                    onClick={() => handleStaffSelect(null)}
                                    className={`text-left w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between shadow-sm ${
                                        selectedStaff === null
                                            ? "border-primary bg-primary/10 text-foreground"
                                            : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-secondary/20"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
                                            *
                                        </div>
                                        <div>
                                            <h4 className="font-serif text-base font-semibold text-foreground">Any Available</h4>
                                            <p className="text-muted-foreground text-xs">Selects the first free provider</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-primary" />
                                </button>

                                {eligibleStaff.map((member) => (
                                    <button
                                        key={member.id}
                                        onClick={() => handleStaffSelect(member)}
                                        className={`text-left w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between shadow-sm ${
                                            selectedStaff?.id === member.id
                                                ? "border-primary bg-primary/10 text-foreground"
                                                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-secondary/20"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {member.avatar ? (
                                                <img src={member.avatar} alt={member.name} className="h-10 w-10 rounded-full object-cover border border-border" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-xs">
                                                    {member.name.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-serif text-base font-semibold text-foreground">{member.name}</h4>
                                                <p className="text-muted-foreground text-xs">{member.position || 'Specialist'}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-primary" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: SELECT DATE & TIME */}
                    {step === "datetime" && selectedService && (
                        <motion.div
                            key="datetime"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="flex flex-col gap-6 text-left"
                        >
                            <button
                                onClick={() => setStep("staff")}
                                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                Back to staff selection
                            </button>

                            {/* Date horizontal selection */}
                            <div className="flex flex-col">
                                <h4 className="font-serif text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-primary" />
                                    Select Date
                                </h4>
                                
                                <div className="flex gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none w-full">
                                    {dates.map((date) => {
                                        const isSelected = selectedDate && isSameDay(selectedDate, date);
                                        return (
                                            <button
                                                key={date.toISOString()}
                                                onClick={() => handleDateChange(date)}
                                                className={`flex flex-col items-center justify-center min-w-16 shrink-0 snap-start gap-1 rounded-xl border px-3 py-3 transition-colors ${
                                                    isSelected
                                                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                                                        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-secondary/10"
                                                }`}
                                            >
                                                <span className="text-xs">{format(date, "EEE")}</span>
                                                <span className="text-lg font-semibold">{format(date, "d")}</span>
                                                <span className="text-xs">{format(date, "MMM")}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <hr className="border-zinc-200/80" />

                            {/* Time Slots grid */}
                            <div className="flex flex-col">
                                <h4 className="font-serif text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    Select Time
                                </h4>

                                {loadingSlots ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-center">
                                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                                        <p className="text-muted-foreground text-sm">Finding available slots...</p>
                                    </div>
                                ) : slots.length > 0 ? (
                                    <div>
                                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 max-h-[180px] overflow-y-auto pr-1">
                                            {slots.map((slot) => {
                                                const isSelected = selectedTimeSlot?.time_24 === slot.time_24;
                                                return (
                                                    <button
                                                        key={slot.time_24}
                                                        onClick={() => handleTimeSelect(slot)}
                                                        className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                                                            isSelected
                                                                ? "border-primary bg-primary text-primary-foreground shadow-md"
                                                                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-secondary/10"
                                                        }`}
                                                    >
                                                        {slot.time_12}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-5 border-t border-border/60">
                                            <span className="text-xs text-muted-foreground bg-secondary/50 py-1.5 px-3 rounded-lg border border-border w-fit flex items-center gap-1.5">
                                                <Globe className="w-3.5 h-3.5 text-primary" />
                                                Timezone: {timezone}
                                            </span>

                                            <Button
                                                onClick={() => setStep("details")}
                                                disabled={!selectedTimeSlot}
                                                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                Confirm Details
                                                <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-xl p-8 text-center bg-zinc-50/40">
                                        <BanIcon className="w-6 h-6 text-zinc-400 mb-2" />
                                        <p className="text-zinc-500 text-xs">No slots available for this date. Try another day.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: CONTACT DETAILS FORM */}
                    {step === "details" && selectedService && selectedDate && selectedTimeSlot && (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="max-w-md mx-auto text-left"
                        >
                            <button
                                onClick={() => setStep("datetime")}
                                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 transition-colors mb-5"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                Back to scheduling
                            </button>

                            {/* Summary card */}
                            <div className="mb-6 p-4 bg-card border border-border rounded-xl flex items-center justify-between text-left shadow-sm">
                                <div className="space-y-1">
                                    <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Your selection</span>
                                    <p className="font-serif text-lg font-semibold text-foreground">
                                        {selectedService.name} (${(selectedService.price/100).toFixed(2)})
                                    </p>
                                    <p className="text-muted-foreground text-xs font-medium">
                                        {format(selectedDate, "MMMM d, yyyy")} at {selectedTimeSlot.time_12} with {selectedStaff ? selectedStaff.name : "Any Provider"}
                                    </p>
                                </div>
                                <div className="w-9 h-9 bg-secondary/50 rounded-lg flex items-center justify-center border border-border text-primary shrink-0 shadow-sm">
                                    <Clock className="w-4 h-4" />
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                                {Object.keys(form.errors).length > 0 && (
                                    <div className="p-3 mb-2 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs space-y-1">
                                        <p className="font-bold">Could not complete booking:</p>
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            {Object.entries(form.errors).map(([key, err]) => (
                                                <li key={key}>{err}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                <div className="space-y-1.5">
                                    <Label htmlFor="client_name" className="text-foreground text-xs font-semibold">Your Full Name</Label>
                                    <div className="relative">
                                        <Input
                                            id="client_name"
                                            required
                                            value={form.data.client_name}
                                            onChange={(e) => form.setData("client_name", e.target.value)}
                                            placeholder="Alex Mercer"
                                            className="pl-9 h-11 border-border bg-card text-foreground rounded-xl text-sm shadow-sm focus-visible:border-primary focus-visible:ring-primary/20"
                                        />
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <InputError message={form.errors.client_name} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="client_email" className="text-foreground text-xs font-semibold">Email Address</Label>
                                    <div className="relative">
                                        <Input
                                            id="client_email"
                                            type="email"
                                            required
                                            value={form.data.client_email}
                                            onChange={(e) => form.setData("client_email", e.target.value)}
                                            placeholder="alex@example.com"
                                            className="pl-9 h-11 border-border bg-card text-foreground rounded-xl text-sm shadow-sm focus-visible:border-primary focus-visible:ring-primary/20"
                                        />
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <InputError message={form.errors.client_email} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="client_phone" className="text-foreground text-xs font-semibold">Phone Number (Optional)</Label>
                                    <div className="relative">
                                        <Input
                                            id="client_phone"
                                            type="tel"
                                            value={form.data.client_phone}
                                            onChange={(e) => form.setData("client_phone", e.target.value)}
                                            placeholder="+1 (555) 000-0000"
                                            className="pl-9 h-11 border-border bg-card text-foreground rounded-xl text-sm shadow-sm focus-visible:border-primary focus-visible:ring-primary/20"
                                        />
                                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <InputError message={form.errors.client_phone} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="notes" className="text-foreground text-xs font-semibold">Special Instructions (Optional)</Label>
                                    <Textarea
                                        id="notes"
                                        rows={2}
                                        value={form.data.notes}
                                        onChange={(e) => form.setData("notes", e.target.value)}
                                        placeholder="Any notes or requests for the specialist..."
                                        className="border-border bg-card text-foreground rounded-xl text-sm shadow-sm focus-visible:border-primary focus-visible:ring-primary/20"
                                    />
                                    <InputError message={form.errors.notes} />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={form.processing || !form.data.client_name || !form.data.client_email}
                                    className="w-full inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-8 py-3.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 mt-6 shadow-sm"
                                >
                                    {form.processing ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            Book Appointment
                                            <CheckCircle2 className="w-4 h-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    )}

                    {/* STEP 5: SUCCESS CONFIRMATION */}
                    {step === "success" && bookingSuccess && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-md mx-auto text-center py-6"
                        >
                            <div className="w-14 h-14 bg-primary/10 border border-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm shadow-primary/10">
                                <CheckCircle2 className="w-7 h-7" />
                            </div>

                            <h3 className="font-serif text-2xl font-semibold text-foreground mb-1.5">Запись подтверждена!</h3>
                            <p className="text-muted-foreground text-sm mb-6">
                                Мы отправили подтверждение на электронную почту <span className="text-foreground font-medium">{bookingSuccess.client_email}</span>.
                            </p>

                            <div className="bg-card border border-border rounded-2xl p-5 mb-6 space-y-3.5 text-left max-w-sm mx-auto shadow-sm text-sm">
                                <div>
                                    <span className="text-[10px] text-muted-foreground block uppercase tracking-wider font-bold">Салон</span>
                                    <span className="font-serif text-base font-semibold text-foreground">{venue.name}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-muted-foreground block uppercase tracking-wider font-bold">Услуга</span>
                                    <span className="font-serif text-base font-semibold text-foreground">{bookingSuccess.service_name}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-muted-foreground block uppercase tracking-wider font-bold">Дата и время</span>
                                    <span className="font-semibold text-foreground">
                                        {format(new Date(bookingSuccess.booking_date), "EEEE, MMMM dd, yyyy")}
                                    </span>
                                    <span className="text-muted-foreground block mt-0.5">
                                        {bookingSuccess.start_time} ({timezone})
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-muted-foreground block uppercase tracking-wider font-bold">Специалист</span>
                                    <span className="font-semibold text-foreground">{bookingSuccess.staff_name}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setStep("service");
                                    setSelectedService(null);
                                    setSelectedStaff(null);
                                    setSelectedTimeSlot(null);
                                    form.reset();
                                }}
                                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                            >
                                Записаться на другую услугу
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}

// Custom ban/empty icon component
function BanIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="m4.9 4.9 14.2 14.2" />
        </svg>
    );
}
