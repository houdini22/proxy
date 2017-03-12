<?php

namespace App\Mail;

use Cartalyst\Sentinel\Laravel\Facades\Activation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ConfirmAccount extends Mailable
{
    use Queueable, SerializesModels;

    protected $_code = NULL;

    protected $_token = NULL;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($code, $token)
    {
        $this->_code = $code;
        $this->_token = $token;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this
            ->from('no-reply@proxydatabase.net')
            ->view('emails.confirm_account')
            ->with('url', url('/api/v1/confirm_account/' . $this->_token . '/' . $this->_code));
    }
}
