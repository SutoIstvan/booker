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
        // Staff belongs to this service if service is in their services array
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
        <Card className="border-zinc-800 bg-zinc-900/30 backdrop-blur-xl overflow-hidden rounded-2xl shadow-xl">
            <CardContent className="p-6 sm:p-8">
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
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Select Service</h3>
                                <p className="text-zinc-400 text-xs">Choose the treatment or service you would like to book.</p>
                            </div>

                            <div className="grid gap-3.5 max-h-[380px] overflow-y-auto pr-1">
                                {services.map((service) => (
                                    <button
                                        key={service.id}
                                        onClick={() => handleServiceSelect(service)}
                                        className="text-left w-full p-4 rounded-xl border border-zinc-800 bg-zinc-950/20 hover:border-zinc-700 hover:bg-zinc-900/40 transition-all duration-300 group flex items-center justify-between gap-4"
                                    >
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-white text-base group-hover:text-neutral-100 transition-colors">
                                                {service.name}
                                            </h4>
                                            {service.description && (
                                                <p className="text-zinc-400 text-xs line-clamp-1">{service.description}</p>
                                            )}
                                            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-semibold pt-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{service.duration_minutes} min</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-base font-extrabold text-white">
                                                ${(service.price / 100).toFixed(2)}
                                            </span>
                                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5 group-hover:text-zinc-300 flex items-center gap-0.5 justify-end">
                                                Select <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
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
                            className="space-y-6"
                        >
                            <button
                                onClick={() => setStep("service")}
                                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                Back to services
                            </button>

                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Select Professional</h3>
                                <p className="text-zinc-400 text-xs">Pick an available specialist or select any available.</p>
                            </div>

                            <div className="grid gap-3 max-h-[380px] overflow-y-auto">
                                {/* Any Available Option */}
                                <button
                                    onClick={() => handleStaffSelect(null)}
                                    className={`text-left w-full p-4 rounded-xl border bg-zinc-950/20 hover:border-zinc-700 hover:bg-zinc-900/40 transition-all duration-300 flex items-center justify-between ${
                                        selectedStaff === null ? "border-white bg-zinc-900/50" : "border-zinc-800"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white">
                                            *
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Any Available</h4>
                                            <p className="text-zinc-500 text-xs">Selects the first free provider</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-zinc-500" />
                                </button>

                                {eligibleStaff.map((member) => (
                                    <button
                                        key={member.id}
                                        onClick={() => handleStaffSelect(member)}
                                        className={`text-left w-full p-4 rounded-xl border bg-zinc-950/20 hover:border-zinc-700 hover:bg-zinc-900/40 transition-all duration-300 flex items-center justify-between ${
                                            selectedStaff?.id === member.id ? "border-white bg-zinc-900/50" : "border-zinc-800"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {member.avatar ? (
                                                <img src={member.avatar} alt={member.name} className="h-10 w-10 rounded-full object-cover border border-zinc-700" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-300">
                                                    {member.name.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-bold text-white">{member.name}</h4>
                                                <p className="text-zinc-400 text-xs">{member.position || 'Specialist'}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-zinc-500" />
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
                            className="flex flex-col gap-6"
                        >
                            <button
                                onClick={() => setStep("staff")}
                                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                Back to staff selection
                            </button>

                            {/* Date horizontal selection */}
                            <div className="flex flex-col">
                                <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-zinc-400" />
                                    Select Date
                                </h4>
                                
                                <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-none w-full">
                                    {dates.map((date) => {
                                        const isSelected = selectedDate && isSameDay(selectedDate, date);
                                        return (
                                            <button
                                                key={date.toISOString()}
                                                onClick={() => handleDateChange(date)}
                                                className={`flex flex-col items-center justify-center min-w-[68px] py-3.5 rounded-xl border transition-all duration-300 ${
                                                    isSelected
                                                        ? "bg-white text-zinc-950 border-white shadow-lg"
                                                        : "bg-zinc-950/30 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50"
                                                }`}
                                            >
                                                <span className="text-[9px] uppercase font-bold tracking-wider opacity-60">
                                                    {format(date, "EEE")}
                                                </span>
                                                <span className="text-base font-extrabold mt-0.5 leading-none">
                                                    {format(date, "d")}
                                                </span>
                                                <span className="text-[8px] uppercase tracking-wider opacity-60 mt-0.5">
                                                    {format(date, "MMM")}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <hr className="border-zinc-800/60" />

                            {/* Time Slots grid */}
                            <div className="flex flex-col">
                                <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-zinc-400" />
                                    Select Time
                                </h4>

                                {loadingSlots ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-center">
                                        <Loader2 className="w-8 h-8 text-zinc-600 animate-spin mb-2" />
                                        <p className="text-zinc-500 text-xs">Finding available slots...</p>
                                    </div>
                                ) : slots.length > 0 ? (
                                    <div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-[180px] overflow-y-auto pr-1">
                                            {slots.map((slot) => (
                                                <button
                                                    key={slot.time_24}
                                                    onClick={() => handleTimeSelect(slot)}
                                                    className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all duration-300 ${
                                                        selectedTimeSlot?.time_24 === slot.time_24
                                                            ? "bg-white text-zinc-950 border-white shadow-lg"
                                                            : "bg-zinc-950/30 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900/50"
                                                    }`}
                                                >
                                                    {slot.time_12}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-5 border-t border-zinc-800/60">
                                            <span className="text-[10px] text-zinc-500 bg-zinc-950/20 py-1.5 px-2.5 rounded-lg border border-zinc-800/40 w-fit flex items-center gap-1.5">
                                                <Globe className="w-3.5 h-3.5" />
                                                Timezone: {timezone}
                                            </span>

                                            <Button
                                                onClick={() => setStep("details")}
                                                disabled={!selectedTimeSlot}
                                                style={{ backgroundColor: selectedTimeSlot ? pColor : undefined }}
                                                className="shimmer-btn text-white rounded-xl h-11 px-6 text-xs font-semibold flex items-center justify-center gap-1.5"
                                            >
                                                Confirm Details
                                                <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-xl p-8 text-center bg-zinc-950/10">
                                        <BanIcon className="w-6 h-6 text-zinc-600 mb-2" />
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
                            className="max-w-md mx-auto"
                        >
                            <button
                                onClick={() => setStep("datetime")}
                                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors mb-5"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                Back to scheduling
                            </button>

                            {/* Summary card */}
                            <div className="mb-6 p-4 bg-zinc-950/40 border border-zinc-800 rounded-xl flex items-center justify-between text-left">
                                <div className="space-y-1">
                                    <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Your selection</span>
                                    <p className="text-white font-bold text-sm">
                                        {selectedService.name} (${(selectedService.price/100).toFixed(2)})
                                    </p>
                                    <p className="text-zinc-400 text-xs">
                                        {format(selectedDate, "MMMM d, yyyy")} at {selectedTimeSlot.time_12} with {selectedStaff ? selectedStaff.name : "Any Provider"}
                                    </p>
                                </div>
                                <div className="w-9 h-9 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800 text-zinc-400 shrink-0">
                                    <Clock className="w-4 h-4" />
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                                {Object.keys(form.errors).length > 0 && (
                                    <div className="p-3 mb-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs space-y-1">
                                        <p className="font-bold">Could not complete booking:</p>
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            {Object.entries(form.errors).map(([key, err]) => (
                                                <li key={key}>{err}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div className="space-y-1.5">
                                    <Label htmlFor="client_name" className="text-zinc-300 text-xs font-semibold">Your Full Name</Label>
                                    <div className="relative">
                                        <Input
                                            id="client_name"
                                            required
                                            value={form.data.client_name}
                                            onChange={(e) => form.setData("client_name", e.target.value)}
                                            placeholder="Alex Mercer"
                                            className="pl-9 h-10 border-zinc-800 bg-zinc-950/20 text-white rounded-xl text-xs"
                                        />
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    </div>
                                    <InputError message={form.errors.client_name} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="client_email" className="text-zinc-300 text-xs font-semibold">Email Address</Label>
                                    <div className="relative">
                                        <Input
                                            id="client_email"
                                            type="email"
                                            required
                                            value={form.data.client_email}
                                            onChange={(e) => form.setData("client_email", e.target.value)}
                                            placeholder="alex@example.com"
                                            className="pl-9 h-10 border-zinc-800 bg-zinc-950/20 text-white rounded-xl text-xs"
                                        />
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    </div>
                                    <InputError message={form.errors.client_email} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="client_phone" className="text-zinc-300 text-xs font-semibold">Phone Number (Optional)</Label>
                                    <div className="relative">
                                        <Input
                                            id="client_phone"
                                            type="tel"
                                            value={form.data.client_phone}
                                            onChange={(e) => form.setData("client_phone", e.target.value)}
                                            placeholder="+1 (555) 000-0000"
                                            className="pl-9 h-10 border-zinc-800 bg-zinc-950/20 text-white rounded-xl text-xs"
                                        />
                                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    </div>
                                    <InputError message={form.errors.client_phone} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="notes" className="text-zinc-300 text-xs font-semibold">Special Instructions (Optional)</Label>
                                    <Textarea
                                        id="notes"
                                        rows={2}
                                        value={form.data.notes}
                                        onChange={(e) => form.setData("notes", e.target.value)}
                                        placeholder="Any notes or requests for the specialist..."
                                        className="border-zinc-800 bg-zinc-950/20 text-white rounded-xl text-xs"
                                    />
                                    <InputError message={form.errors.notes} />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={form.processing || !form.data.client_name || !form.data.client_email}
                                    style={{ backgroundColor: pColor }}
                                    className="w-full text-white rounded-xl h-11 text-xs font-semibold flex items-center justify-center gap-1.5 mt-6"
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
                            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/5">
                                <CheckCircle2 className="w-7 h-7" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-1.5">Appointment Booked!</h3>
                            <p className="text-zinc-400 text-xs mb-6">
                                We've sent a confirmation email with details to <span className="text-zinc-300 font-semibold">{bookingSuccess.client_email}</span>.
                            </p>

                            <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-4 mb-6 space-y-3 text-left max-w-sm mx-auto shadow-inner text-xs">
                                <div>
                                    <span className="text-[10px] text-zinc-500 block uppercase tracking-wider font-bold">Venue</span>
                                    <span className="font-semibold text-zinc-300">{venue.name}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-zinc-500 block uppercase tracking-wider font-bold">Service</span>
                                    <span className="font-semibold text-zinc-300">{bookingSuccess.service_name}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-zinc-500 block uppercase tracking-wider font-bold">Date & Time</span>
                                    <span className="font-semibold text-zinc-300">
                                        {format(new Date(bookingSuccess.booking_date), "EEEE, MMMM dd, yyyy")}
                                    </span>
                                    <span className="text-zinc-400 block mt-0.5">
                                        {bookingSuccess.start_time} ({timezone})
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-zinc-500 block uppercase tracking-wider font-bold">Provider</span>
                                    <span className="font-semibold text-zinc-300">{bookingSuccess.staff_name}</span>
                                </div>
                            </div>

                            <Button
                                onClick={() => {
                                    setStep("service");
                                    setSelectedService(null);
                                    setSelectedStaff(null);
                                    setSelectedTimeSlot(null);
                                    form.reset();
                                }}
                                className="rounded-xl px-5 h-10 text-xs font-semibold border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white hover:border-zinc-700 bg-transparent"
                            >
                                Book Another Service
                            </Button>
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
