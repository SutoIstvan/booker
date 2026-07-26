<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingManagementController extends Controller
{
    /**
     * Update the status of a booking.
     */
    public function updateStatus(Request $request, Booking $booking): RedirectResponse
    {
        // Authorize that the booking belongs to a venue owned by the current user
        if ($booking->venue->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,confirmed,cancelled,completed'],
        ]);

        $booking->update([
            'status' => $validated['status'],
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Booking status updated to ' . $validated['status'] . '.']);

        return redirect()->back();
    }
}
