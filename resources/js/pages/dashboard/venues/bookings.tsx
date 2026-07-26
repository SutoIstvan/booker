import { router } from '@inertiajs/react';
import { Calendar, User, Phone, Mail, Clock, CheckCircle2, XCircle, AlertCircle, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { format } from 'date-fns';

interface Service {
    id: number;
    name: string;
    duration_minutes: number;
}

interface StaffMember {
    id: number;
    name: string;
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
}

interface Props {
    venue: Venue;
    bookings: Booking[];
}

export default function VenueBookings({ venue, bookings }: Props) {
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const handleStatusChange = (bookingId: number, status: string) => {
        router.patch(`/dashboard/bookings/${bookingId}/status`, { status });
    };

    const filteredBookings = bookings.filter((b) => {
        if (statusFilter === 'all') return true;
        return b.status === statusFilter;
    });

    const getStatusBadge = (status: Booking['status']) => {
        switch (status) {
            case 'confirmed':
                return (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800 rounded-full font-semibold">
                        Confirmed
                    </Badge>
                );
            case 'completed':
                return (
                    <Badge variant="outline" className="bg-neutral-100 text-neutral-800 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-800 rounded-full font-semibold">
                        Completed
                    </Badge>
                );
            case 'cancelled':
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800 rounded-full font-semibold">
                        Cancelled
                    </Badge>
                );
            case 'pending':
            default:
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800 rounded-full font-semibold">
                        Pending
                    </Badge>
                );
        }
    };

    const formatTime = (time24: string) => {
        try {
            // "09:00:00" -> "9:00 AM"
            const [h, m] = time24.split(':');
            const hour = parseInt(h);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 === 0 ? 12 : hour % 12;
            return `${displayHour}:${m} ${ampm}`;
        } catch (e) {
            return time24;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Bookings Log</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        View client appointments, confirm, cancel or complete entries.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-400">Filter:</span>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px] rounded-xl border-neutral-200 dark:border-neutral-800">
                            <SelectValue placeholder="All Bookings" />
                        </SelectTrigger>
                        <SelectContent className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                            <SelectItem value="all">All Bookings</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card className="border-neutral-200 dark:border-neutral-800">
                <CardContent className="p-0">
                    {filteredBookings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center text-neutral-500 dark:text-neutral-400">
                            <Calendar className="h-10 w-10 text-neutral-300 dark:text-neutral-700 mb-3" />
                            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">No bookings found</h3>
                            <p className="text-xs max-w-xs mt-1">There are no client bookings under this filter at the moment.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-neutral-200 dark:border-neutral-800">
                                    <TableHead>Client & Contact</TableHead>
                                    <TableHead>Appointment Details</TableHead>
                                    <TableHead>Staff Member</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBookings.map((booking) => (
                                    <TableRow key={booking.id} className="border-neutral-200 dark:border-neutral-800">
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="font-semibold text-neutral-900 dark:text-neutral-50 flex items-center gap-1.5">
                                                    <User className="h-3.5 w-3.5 text-neutral-400" />
                                                    {booking.client_name}
                                                </div>
                                                <div className="text-xs text-neutral-400 flex items-center gap-1.5">
                                                    <Mail className="h-3 w-3" />
                                                    {booking.client_email}
                                                </div>
                                                {booking.client_phone && (
                                                    <div className="text-xs text-neutral-400 flex items-center gap-1.5">
                                                        <Phone className="h-3 w-3" />
                                                        {booking.client_phone}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                    {booking.service.name}
                                                </div>
                                                <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 text-neutral-400" />
                                                    {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
                                                    <Clock className="h-3 w-3 text-neutral-400 ml-1.5" />
                                                    {formatTime(booking.start_time)}
                                                </div>
                                                {booking.notes && (
                                                    <span className="block text-[11px] text-neutral-400 max-w-[200px] truncate">
                                                        Note: "{booking.notes}"
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                            {booking.staff_member.name}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                        <TableCell className="text-right">
                                            {booking.status === 'confirmed' && (
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="rounded-lg text-xs h-8 border-neutral-200 dark:border-neutral-800"
                                                        onClick={() => handleStatusChange(booking.id, 'completed')}
                                                    >
                                                        <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-emerald-500" />
                                                        Complete
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="rounded-lg text-xs h-8 text-neutral-400 hover:text-red-500"
                                                        onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                                    >
                                                        <Ban className="mr-1 h-3.5 w-3.5" />
                                                        Cancel
                                                    </Button>
                                                </div>
                                            )}
                                            {booking.status === 'cancelled' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-lg text-xs h-8"
                                                    onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                                >
                                                    Re-confirm
                                                </Button>
                                            )}
                                            {booking.status === 'completed' && (
                                                <span className="text-xs text-neutral-400 font-medium">Done</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
