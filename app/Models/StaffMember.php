<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $venue_id
 * @property string $name
 * @property string|null $avatar
 * @property string|null $position
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
#[Fillable([
    'venue_id',
    'name',
    'avatar',
    'position',
    'is_active',
])]
class StaffMember extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the venue where this staff member works.
     */
    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    /**
     * Get the services that this staff member provides.
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'staff_services');
    }

    /**
     * Get the bookings assigned to this staff member.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
