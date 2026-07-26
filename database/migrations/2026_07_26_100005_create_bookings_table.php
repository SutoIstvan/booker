<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('venue_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->foreignId('staff_member_id')->constrained('staff_members')->cascadeOnDelete();
            $table->string('client_name');
            $table->string('client_email');
            $table->string('client_phone')->nullable();
            $table->date('booking_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('status')->default('confirmed'); // default confirmed, could be cancelled or completed
            $table->text('notes')->nullable();
            $table->string('cancel_token')->unique();
            $table->timestamps();

            $table->index(['venue_id', 'booking_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
