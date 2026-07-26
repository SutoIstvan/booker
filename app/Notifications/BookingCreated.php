<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Carbon\Carbon;

class BookingCreated extends Notification implements ShouldQueue
{
    use Queueable;

    protected Booking $booking;

    /**
     * Create a new notification instance.
     */
    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $venue = $this->booking->venue;
        $service = $this->booking->service;
        $staff = $this->booking->staffMember;
        $dateFormatted = Carbon::parse($this->booking->booking_date)->format('F d, Y');
        $timeFormatted = Carbon::createFromFormat('H:i:s', $this->booking->start_time)->format('g:i A');

        return (new MailMessage)
            ->subject('Booking Confirmed: ' . $service->name . ' at ' . $venue->name)
            ->greeting('Hello ' . $this->booking->client_name . ',')
            ->line('Your booking at ' . $venue->name . ' is confirmed!')
            ->line('**Here are your appointment details:**')
            ->line('📅 **Date:** ' . $dateFormatted)
            ->line('⏰ **Time:** ' . $timeFormatted)
            ->line('👤 **Provider:** ' . $staff->name)
            ->line('🏷️ **Service:** ' . $service->name)
            ->line('📍 **Location:** ' . $venue->address . ', ' . $venue->city)
            ->line('📞 **Phone:** ' . $venue->phone)
            ->action('Cancel Booking', url('/booking/' . $this->booking->cancel_token . '/cancel'))
            ->line('If you need to reschedule, please contact us directly. Thank you for booking with us!');
    }
}
