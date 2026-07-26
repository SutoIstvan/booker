<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use Inertia\Inertia;
use Inertia\Response;

class PublicVenueController extends Controller
{
    /**
     * Show the public booking page for a venue.
     */
    public function show(string $slug): Response
    {
        $venue = Venue::where('slug', $slug)
            ->where('is_active', true)
            ->with([
                'services' => function ($query) {
                    $query->where('is_active', true)->orderBy('sort_order');
                },
                'staffMembers' => function ($query) {
                    $query->where('is_active', true)->with('services');
                },
                'workingHours',
            ])
            ->firstOrFail();

        return Inertia::render('venue-page', [
            'venue' => $venue,
        ]);
    }
}
