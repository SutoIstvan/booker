<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Venue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    /**
     * Store a newly created service in storage.
     */
    public function store(Request $request, Venue $venue): RedirectResponse
    {
        if ($venue->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'duration_minutes' => ['required', 'integer', 'min:5', 'max:480'],
            'price' => ['required', 'numeric', 'min:0'], // client passes decimal, we store minor units (cents)
            'is_active' => ['required', 'boolean'],
        ]);

        $venue->services()->create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'duration_minutes' => $validated['duration_minutes'],
            'price' => (int) ($validated['price'] * 100),
            'currency' => 'USD',
            'is_active' => $validated['is_active'],
            'sort_order' => $venue->services()->count(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Service created successfully.']);

        return redirect()->back();
    }

    /**
     * Update the specified service in storage.
     */
    public function update(Request $request, Venue $venue, Service $service): RedirectResponse
    {
        if ($venue->user_id !== $request->user()->id || $service->venue_id !== $venue->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'duration_minutes' => ['required', 'integer', 'min:5', 'max:480'],
            'price' => ['required', 'numeric', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ]);

        $service->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'duration_minutes' => $validated['duration_minutes'],
            'price' => (int) ($validated['price'] * 100),
            'is_active' => $validated['is_active'],
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Service updated successfully.']);

        return redirect()->back();
    }

    /**
     * Remove the specified service from storage.
     */
    public function destroy(Request $request, Venue $venue, Service $service): RedirectResponse
    {
        if ($venue->user_id !== $request->user()->id || $service->venue_id !== $venue->id) {
            abort(403);
        }

        $service->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Service deleted successfully.']);

        return redirect()->back();
    }
}
