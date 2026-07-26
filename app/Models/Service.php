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
 * @property string|null $description
 * @property int $duration_minutes
 * @property int $price
 * @property string $currency
 * @property bool $is_active
 * @property int $sort_order
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
#[Fillable([
    'venue_id',
    'name',
    'description',
    'duration_minutes',
    'price',
    'currency',
    'is_active',
    'sort_order',
])]
class Service extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'duration_minutes' => 'integer',
            'price' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    /**
     * Get the venue that offers this service.
     */
    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    /**
     * Get the staff members that provide this service.
     */
    public function staffMembers(): BelongsToMany
    {
        return $this->belongsToMany(StaffMember::class, 'staff_services');
    }

    /**
     * Get the bookings for this service.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Helper to get formatted price.
     */
    public function getFormattedPriceAttribute(): string
    {
        // Simple formatter since we only support USD/English for now
        return '$' . number_format($this->price / 100, 2);
    }
}
