<?php

namespace App\Actions;

use App\Models\Service;
use App\Models\Venue;
use App\Models\StaffMember;
use App\Models\Booking;
use Carbon\Carbon;

class SlotAvailabilityService
{
    /**
     * Get available booking slots for a venue, service, and date.
     *
     * @param Venue $venue
     * @param Service $service
     * @param string $dateStr (YYYY-MM-DD)
     * @param int|null $staffMemberId (optional filter)
     * @return array Array of formatted time slots (e.g., ["09:00 AM", "09:30 AM", ...])
     */
    public function getAvailableSlots(Venue $venue, Service $service, string $dateStr, ?int $staffMemberId = null): array
    {
        $date = Carbon::parse($dateStr);
        $dayOfWeek = $date->dayOfWeek; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Get venue schedule for this day of week
        $schedule = $venue->workingHours()
            ->where('day_of_week', $dayOfWeek)
            ->first();

        if (!$schedule || $schedule->is_day_off) {
            return [];
        }

        $openTime = Carbon::createFromFormat('H:i:s', $schedule->open_time);
        $closeTime = Carbon::createFromFormat('H:i:s', $schedule->close_time);

        // Fetch staff members who provide this service
        $staffQuery = $service->staffMembers()->where('is_active', true);
        if ($staffMemberId) {
            $staffQuery->where('staff_members.id', $staffMemberId);
        }
        $staff = $staffQuery->get();

        if ($staff->isEmpty()) {
            return [];
        }

        // Fetch bookings for this venue on this date
        $bookings = Booking::where('venue_id', $venue->id)
            ->whereDate('booking_date', $dateStr)
            ->where('status', '!=', 'cancelled')
            ->get();

        $slots = [];
        $slotStepMinutes = 30; // standard slot interval step
        $serviceDuration = $service->duration_minutes;

        // Start checking from the open time
        $currentTime = $openTime->copy();

        // If booking for today, do not allow slots in the past
        $now = Carbon::now();
        $isToday = $date->isToday();

        while ($currentTime->copy()->addMinutes($serviceDuration)->lte($closeTime)) {
            $slotStart = $currentTime->copy();
            $slotEnd = $currentTime->copy()->addMinutes($serviceDuration);

            // Skip if the slot start time is in the past (for today's bookings)
            if ($isToday) {
                // Combine date and slot start time to compare with current time
                $slotStartDateTime = Carbon::parse($dateStr . ' ' . $slotStart->format('H:i:s'));
                if ($slotStartDateTime->lte($now)) {
                    $currentTime->addMinutes($slotStepMinutes);
                    continue;
                }
            }

            // Check if there is at least one staff member available for this slot
            $hasAvailableStaff = false;
            foreach ($staff as $member) {
                // Check if this member is busy during slotStart and slotEnd
                $isBusy = $bookings->contains(function (Booking $booking) use ($member, $slotStart, $slotEnd) {
                    if ($booking->staff_member_id != $member->id) {
                        return false;
                    }

                    $bStart = Carbon::createFromFormat('H:i:s', $booking->start_time);
                    $bEnd = Carbon::createFromFormat('H:i:s', $booking->end_time);

                    // Overlap check: b_start < slot_end && slot_start < b_end
                    return $bStart->lt($slotEnd) && $slotStart->lt($bEnd);
                });

                if (!$isBusy) {
                    $hasAvailableStaff = true;
                    break; // found one available staff member, this slot is good!
                }
            }

            if ($hasAvailableStaff) {
                $slots[] = [
                    'time_24' => $slotStart->format('H:i'),
                    'time_12' => $slotStart->format('g:i A'),
                ];
            }

            $currentTime->addMinutes($slotStepMinutes);
        }

        return $slots;
    }
}
