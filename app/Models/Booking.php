<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $venue_id
 * @property int $service_id
 * @property int $staff_member_id
 * @property string $client_name
 * @property string $client_email
 * @property string|null $client_phone
 * @property \Illuminate\Support\Carbon $booking_date
 * @property string $start_time
 * @property string $end_time
 * @property string $status
 * @property string|null $notes
 * @property string $cancel_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
#[Fillable([
    'venue_id',
    'service_id',
    'staff_member_id',
    'client_name',
    'client_email',
    'client_phone',
    'booking_date',
    'start_time',
    'end_time',
    'status',
    'notes',
    'cancel_token',
])]
class Booking extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'booking_date' => 'date',
        ];
    }

    /**
     * Get the venue where the booking is made.
     */
    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    /**
     * Get the service booked.
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Get the staff member assigned to this booking.
     */
    public function staffMember(): BelongsTo
    {
        return $this->belongsTo(StaffMember::class);
    }
}
