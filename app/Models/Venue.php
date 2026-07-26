<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string|null $category
 * @property string|null $phone
 * @property string|null $address
 * @property string|null $city
 * @property string|null $cover_image
 * @property string|null $logo
 * @property string $primary_color
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
#[Fillable([
    'user_id',
    'name',
    'slug',
    'description',
    'category',
    'phone',
    'address',
    'city',
    'cover_image',
    'logo',
    'gallery',
    'portfolio',
    'primary_color',
    'is_active',
])]
class Venue extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'gallery' => 'array',
            'portfolio' => 'array',
        ];
    }

    /**
     * Get the user that owns the venue.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the services for the venue.
     */
    public function services(): HasMany
    {
        return $this->hasMany(Service::class)->orderBy('sort_order');
    }

    /**
     * Get the staff members for the venue.
     */
    public function staffMembers(): HasMany
    {
        return $this->hasMany(StaffMember::class);
    }

    /**
     * Get the working hours schedule for the venue.
     */
    public function workingHours(): HasMany
    {
        return $this->hasMany(WorkingHour::class)->orderBy('day_of_week');
    }

    /**
     * Get the bookings for the venue.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * List of reserved slugs that cannot be used for venues.
     */
    public static function reservedSlugs(): array
    {
        return [
            'dashboard',
            'login',
            'logout',
            'register',
            'settings',
            'api',
            'booking',
            'password',
            'email',
            'profile',
            'auth',
            'admin',
        ];
    }
}
