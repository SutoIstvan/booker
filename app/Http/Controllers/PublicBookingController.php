<?php

namespace App\Http\Controllers;

use App\Actions\CreateBookingAction;
use App\Actions\SlotAvailabilityService;
use App\Models\Booking;
use App\Models\Service;
use App\Models\Venue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class PublicBookingController extends Controller
{
    /**
     * Get available slots for a venue/service/date.
     */
    public function availableSlots(
        Request $request,
        string $slug,
        SlotAvailabilityService $slotService
    ): JsonResponse {
        $venue = Venue::where('slug', $slug)->where('is_active', true)->firstOrFail();

        $request->validate([
            'service_id' => ['required', 'exists:services,id'],
            'date' => ['required', 'date_format:Y-m-d'],
            'staff_member_id' => ['nullable', 'exists:staff_members,id'],
        ]);

        $service = Service::findOrFail($request->input('service_id'));
        $date = $request->input('date');
        $staffMemberId = $request->input('staff_member_id');

        // Check if service belongs to venue
        if ($service->venue_id !== $venue->id) {
            return response()->json(['error' => 'Service not found at this venue.'], 404);
        }

        $slots = $slotService->getAvailableSlots($venue, $service, $date, $staffMemberId);

        return response()->json([
            'slots' => $slots,
        ]);
    }

    /**
     * Create a public booking.
     */
    public function store(
        Request $request,
        string $slug,
        CreateBookingAction $createBookingAction
    ): RedirectResponse {
        $venue = Venue::where('slug', $slug)->where('is_active', true)->firstOrFail();

        $validated = $request->validate([
            'service_id' => ['required', 'exists:services,id'],
            'staff_member_id' => ['nullable', 'exists:staff_members,id'],
            'client_name' => ['required', 'string', 'max:255'],
            'client_email' => ['required', 'email', 'max:255'],
            'client_phone' => ['nullable', 'string', 'max:255'],
            'booking_date' => ['required', 'date_format:Y-m-d'],
            'start_time' => ['required', 'string', 'regex:/^\d{2}:\d{2}$/'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        // Add venue_id to the data
        $validated['venue_id'] = $venue->id;

        $booking = $createBookingAction->execute($validated);

        return redirect()->back()->with('bookingSuccess', [
            'id' => $booking->id,
            'client_name' => $booking->client_name,
            'client_email' => $booking->client_email,
            'booking_date' => $booking->booking_date->format('Y-m-d'),
            'start_time' => Carbon::createFromFormat('H:i:s', $booking->start_time)->format('g:i A'),
            'staff_name' => $booking->staffMember->name,
            'service_name' => $booking->service->name,
        ]);
    }

    /**
     * Cancel a booking using token.
     */
    public function cancel(string $token): Response
    {
        $booking = Booking::where('cancel_token', $token)->firstOrFail();

        if ($booking->status !== 'cancelled') {
            $booking->update([
                'status' => 'cancelled',
            ]);
        }

        return Inertia::render('booking/cancelled', [
            'booking' => $booking->load(['venue', 'service']),
        ]);
    }
}

// Inline Carbon import check
if (!class_exists('Carbon\Carbon')) {
    class_alias('Illuminate\Support\Carbon', 'Carbon\Carbon');
}
