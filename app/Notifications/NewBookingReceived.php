<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Carbon\Carbon;

class NewBookingReceived extends Notification implements ShouldQueue
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

        $mailMessage = (new MailMessage)
            ->subject('New Booking: ' . $service->name . ' at ' . $venue->name)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('You have received a new booking at ' . $venue->name . '.')
            ->line('**Appointment details:**')
            ->line('👤 **Client:** ' . $this->booking->client_name)
            ->line('📧 **Email:** ' . $this->booking->client_email)
            ->line('📞 **Phone:** ' . ($this->booking->client_phone ?? 'N/A'))
            ->line('📅 **Date:** ' . $dateFormatted)
            ->line('⏰ **Time:** ' . $timeFormatted)
            ->line('👤 **Staff Member:** ' . $staff->name)
            ->line('🏷️ **Service:** ' . $service->name);

        if ($this->booking->notes) {
            $mailMessage->line('📝 **Notes:** ' . $this->booking->notes);
        }

        return $mailMessage
            ->action('Manage Bookings', url('/dashboard/venues/' . $venue->id . '/edit'))
            ->line('Thank you for using our platform!');
    }
}
