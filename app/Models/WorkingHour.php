<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $venue_id
 * @property int $day_of_week
 * @property string $open_time
 * @property string $close_time
 * @property bool $is_day_off
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
#[Fillable([
    'venue_id',
    'day_of_week',
    'open_time',
    'close_time',
    'is_day_off',
])]
class WorkingHour extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'day_of_week' => 'integer',
            'is_day_off' => 'boolean',
        ];
    }

    /**
     * Get the venue for this working hour slot.
     */
    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }
}
