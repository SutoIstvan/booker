<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use App\Models\WorkingHour;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class VenueController extends Controller
{
    /**
     * Display a listing of the venues.
     */
    public function index(Request $request): Response
    {
        $venues = $request->user()->venues()
            ->withCount('bookings')
            ->get();

        return Inertia::render('dashboard/venues/index', [
            'venues' => $venues,
        ]);
    }

    /**
     * Show the form for creating a new venue.
     */
    public function create(): Response
    {
        return Inertia::render('dashboard/venues/create');
    }

    /**
     * Store a newly created venue in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $reserved = Venue::reservedSlugs();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'unique:venues,slug',
                'alpha_dash',
                function ($attribute, $value, $fail) use ($reserved) {
                    if (in_array(Str::lower($value), $reserved)) {
                        $fail('This URL address is reserved and cannot be used.');
                    }
                },
            ],
            'description' => ['nullable', 'string'],
            'category' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'primary_color' => ['nullable', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
        ]);

        $venue = $request->user()->venues()->create(array_merge($validated, [
            'is_active' => true,
        ]));

        // Seed default working hours for the venue (0 = Sunday, 1 = Monday, etc.)
        // Monday-Friday: 09:00 - 18:00, Saturday-Sunday: Day off
        for ($day = 0; $day <= 6; $day++) {
            WorkingHour::create([
                'venue_id' => $venue->id,
                'day_of_week' => $day,
                'open_time' => '09:00:00',
                'close_time' => '18:00:00',
                'is_day_off' => ($day === 0 || $day === 6), // Saturday and Sunday off
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Venue created successfully.']);

        return to_route('venues.edit', $venue->id);
    }

    /**
     * Show the form for editing the specified venue.
     */
    public function edit(Venue $venue, Request $request): Response
    {
        // Authorize that the user owns the venue
        if ($venue->user_id !== $request->user()->id) {
            abort(403);
        }

        return Inertia::render('dashboard/venues/edit', [
            'venue' => $venue->load(['services', 'staffMembers', 'workingHours']),
            'bookings' => $venue->bookings()->with(['service', 'staffMember'])->orderBy('booking_date', 'desc')->orderBy('start_time', 'desc')->get(),
        ]);
    }

    /**
     * Update the specified venue in storage.
     */
    public function update(Request $request, Venue $venue): RedirectResponse
    {
        if ($venue->user_id !== $request->user()->id) {
            abort(403);
        }

        $reserved = Venue::reservedSlugs();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'unique:venues,slug,' . $venue->id,
                'alpha_dash',
                function ($attribute, $value, $fail) use ($reserved) {
                    if (in_array(Str::lower($value), $reserved)) {
                        $fail('This URL address is reserved and cannot be used.');
                    }
                },
            ],
            'description' => ['nullable', 'string'],
            'category' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'primary_color' => ['nullable', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'is_active' => ['required', 'boolean'],
        ]);

        $venue->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Venue updated successfully.']);

        return to_route('venues.edit', $venue->id);
    }

    /**
     * Remove the specified venue from storage.
     */
    public function destroy(Venue $venue, Request $request): RedirectResponse
    {
        if ($venue->user_id !== $request->user()->id) {
            abort(403);
        }

        $venue->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Venue deleted successfully.']);

        return to_route('venues.index');
    }
}
