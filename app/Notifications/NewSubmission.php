<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewSubmission extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public string $kind, public int $submissionId) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)->subject('New Dr. Rich Global enquiry')->line('A new '.$this->kind.' submission is ready to review.')->action('Open secure inbox', url('/admin/inbox'))->line('Submission #'.$this->submissionId);
    }
}
