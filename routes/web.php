<?php

use App\Http\Controllers\VenueController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\WorkingHourController;
use App\Http\Controllers\BookingManagementController;
use App\Http\Controllers\PublicVenueController;
use App\Http\Controllers\PublicBookingController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Admin Venues CRUD
    Route::resource('dashboard/venues', VenueController::class);
    // Nested resources
    Route::resource('dashboard/venues/{venue}/services', ServiceController::class)->only(['store', 'update', 'destroy']);
    Route::post('dashboard/venues/{venue}/staff', [StaffController::class, 'store'])->name('staff.store');
    Route::post('dashboard/venues/{venue}/staff/{staff}', [StaffController::class, 'update'])->name('staff.update');
    Route::delete('dashboard/venues/{venue}/staff/{staff}', [StaffController::class, 'destroy'])->name('staff.destroy');
    Route::put('dashboard/venues/{venue}/working-hours', [WorkingHourController::class, 'update'])->name('working-hours.update');
    Route::patch('dashboard/bookings/{booking}/status', [BookingManagementController::class, 'updateStatus'])->name('bookings.status.update');
});

require __DIR__.'/settings.php';

// Public booking cancellation
Route::get('booking/{token}/cancel', [PublicBookingController::class, 'cancel'])->name('booking.cancel');

// Public booking pages (placed at the end to prevent hijacking system paths)
Route::get('{venue}', [PublicVenueController::class, 'show'])->name('venue.public');
Route::get('{venue}/available-slots', [PublicBookingController::class, 'availableSlots'])->name('venue.slots');
Route::post('{venue}/book', [PublicBookingController::class, 'store'])->name('venue.book');

