<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class WelcomeSubscriber extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public int $subscriberId) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)->subject('Welcome to the Dr. Rich Global community')->greeting('Welcome to the community.')->line('Thank you for joining us for ideas, insights, and upcoming experiences.')->line('You can unsubscribe at any time using the link below.')->action('Manage your subscription', URL::signedRoute('newsletter.preferences', ['subscriber' => $this->subscriberId]));
    }
}
