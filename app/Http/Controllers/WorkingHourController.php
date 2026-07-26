<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use App\Models\WorkingHour;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkingHourController extends Controller
{
    /**
     * Update the working hours for a venue.
     */
    public function update(Request $request, Venue $venue): RedirectResponse
    {
        if ($venue->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'hours' => ['required', 'array', 'size:7'],
            'hours.*.day_of_week' => ['required', 'integer', 'min:0', 'max:6'],
            'hours.*.open_time' => ['required', 'string', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
            'hours.*.close_time' => ['required', 'string', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
            'hours.*.is_day_off' => ['required', 'boolean'],
        ]);

        foreach ($validated['hours'] as $hourData) {
            WorkingHour::updateOrCreate(
                [
                    'venue_id' => $venue->id,
                    'day_of_week' => $hourData['day_of_week'],
                ],
                [
                    'open_time' => $hourData['open_time'],
                    'close_time' => $hourData['close_time'],
                    'is_day_off' => $hourData['is_day_off'],
                ]
            );
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Working hours updated successfully.']);

        return redirect()->back();
    }
}
