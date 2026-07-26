<?php

namespace App\Actions;

use App\Models\Booking;
use App\Models\Service;
use App\Models\Venue;
use App\Models\StaffMember;
use App\Notifications\BookingCreated;
use App\Notifications\NewBookingReceived;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CreateBookingAction
{
    /**
     * Create a booking after verifying availability.
     */
    public function execute(array $data): Booking
    {
        return DB::transaction(function () use ($data) {
            $venue = Venue::findOrFail($data['venue_id']);
            $service = Service::findOrFail($data['service_id']);
            $date = Carbon::parse($data['booking_date'])->format('Y-m-d');
            $startTimeStr = $data['start_time']; // 'H:i' format

            $startTime = Carbon::createFromFormat('H:i', $startTimeStr);
            $endTime = $startTime->copy()->addMinutes($service->duration_minutes);

            $startTimeFormatted = $startTime->format('H:i:s');
            $endTimeFormatted = $endTime->format('H:i:s');

            // Find eligible staff members for this service
            $staffQuery = $service->staffMembers()->where('is_active', true);
            if (!empty($data['staff_member_id'])) {
                $staffQuery->where('staff_members.id', $data['staff_member_id']);
            }
            $staffMembers = $staffQuery->get();

            if ($staffMembers->isEmpty()) {
                throw ValidationException::withMessages([
                    'staff_member_id' => ['The selected staff member is not available for this service.'],
                ]);
            }

            // Find existing bookings on this date that are not cancelled
            $existingBookings = Booking::where('venue_id', $venue->id)
                ->whereDate('booking_date', $date)
                ->where('status', '!=', 'cancelled')
                ->get();

            $availableStaffMember = null;

            foreach ($staffMembers as $member) {
                // Check if this member has overlapping bookings
                $isBusy = $existingBookings->contains(function (Booking $booking) use ($member, $startTimeFormatted, $endTimeFormatted) {
                    if ($booking->staff_member_id != $member->id) {
                        return false;
                    }

                    // Overlap check: b_start < slot_end && slot_start < b_end
                    return $booking->start_time < $endTimeFormatted && $startTimeFormatted < $booking->end_time;
                });

                if (!$isBusy) {
                    $availableStaffMember = $member;
                    break;
                }
            }

            if (!$availableStaffMember) {
                throw ValidationException::withMessages([
                    'start_time' => ['The selected time slot is no longer available.'],
                ]);
            }

            // Create booking
            /** @var Booking $booking */
            $booking = Booking::create([
                'venue_id' => $venue->id,
                'service_id' => $service->id,
                'staff_member_id' => $availableStaffMember->id,
                'client_name' => $data['client_name'],
                'client_email' => $data['client_email'],
                'client_phone' => $data['client_phone'] ?? null,
                'booking_date' => $date,
                'start_time' => $startTimeFormatted,
                'end_time' => $endTimeFormatted,
                'status' => 'confirmed',
                'notes' => $data['notes'] ?? null,
                'cancel_token' => Str::uuid()->toString(),
            ]);

            // Notify client
            try {
                $booking->notify(new BookingCreated($booking));
            } catch (\Exception $e) {
                // Log notification failure but don't fail transaction
                logger()->error('Failed to send booking confirmation email: ' . $e->getMessage());
            }

            // Notify admin
            try {
                $venue->user->notify(new NewBookingReceived($booking));
            } catch (\Exception $e) {
                logger()->error('Failed to send admin notification email: ' . $e->getMessage());
            }

            return $booking;
        });
    }
}
