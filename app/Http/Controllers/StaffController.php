<?php

namespace App\Http\Controllers;

use App\Models\StaffMember;
use App\Models\Venue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StaffController extends Controller
{
    /**
     * Store a newly created staff member in storage.
     */
    public function store(Request $request, Venue $venue): RedirectResponse
    {
        if ($venue->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'max:2048'],
            'is_active' => ['required', 'boolean'],
            'services' => ['nullable', 'array'],
            'services.*' => ['exists:services,id'],
        ]);

        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('staff/avatars', 'public');
            $avatarPath = Storage::url($path);
        }

        /** @var StaffMember $staffMember */
        $staffMember = $venue->staffMembers()->create([
            'name' => $validated['name'],
            'position' => $validated['position'],
            'avatar' => $avatarPath,
            'is_active' => $validated['is_active'],
        ]);

        if (!empty($validated['services'])) {
            $staffMember->services()->sync($validated['services']);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Staff member added successfully.']);

        return redirect()->back();
    }

    /**
     * Update the specified staff member in storage.
     */
    public function update(Request $request, Venue $venue, StaffMember $staff): RedirectResponse
    {
        if ($venue->user_id !== $request->user()->id || $staff->venue_id !== $venue->id) {
            abort(403);
        }

        // We use POST method with _method=PUT to support file uploads in Inertia/Laravel
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'max:2048'],
            'is_active' => ['required', 'boolean'],
            'services' => ['nullable', 'array'],
            'services.*' => ['exists:services,id'],
        ]);

        $updateData = [
            'name' => $validated['name'],
            'position' => $validated['position'],
            'is_active' => $validated['is_active'],
        ];

        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($staff->avatar) {
                if (str_starts_with($staff->avatar, '/storage/')) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $staff->avatar));
                } else {
                    @unlink(public_path($staff->avatar));
                }
            }

            $path = $request->file('avatar')->store('staff/avatars', 'public');
            $updateData['avatar'] = Storage::url($path);
        }

        $staff->update($updateData);

        if (isset($validated['services'])) {
            $staff->services()->sync($validated['services']);
        } else {
            $staff->services()->sync([]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Staff member updated successfully.']);

        return redirect()->back();
    }

    /**
     * Remove the specified staff member from storage.
     */
    public function destroy(Request $request, Venue $venue, StaffMember $staff): RedirectResponse
    {
        if ($venue->user_id !== $request->user()->id || $staff->venue_id !== $venue->id) {
            abort(403);
        }

        // Delete avatar if exists
        if ($staff->avatar) {
            if (str_starts_with($staff->avatar, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $staff->avatar));
            } else {
                @unlink(public_path($staff->avatar));
            }
        }

        $staff->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Staff member deleted successfully.']);

        return redirect()->back();
    }
}
