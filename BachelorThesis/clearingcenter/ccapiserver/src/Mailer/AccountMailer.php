<?php

namespace App\Mailer;

use Swift_Mailer;
use Swift_Message;
use Symfony\Bundle\FrameworkBundle\Templating\EngineInterface;
use Symfony\Component\Routing\RouterInterface;

use App\Entity\UserToken;

class AccountMailer
{
    const SUBJECT_ACTIVATION = 'Account Activation';
    const SUBJECT_RESET_PASSWORD = 'Password Reset';

    /**
     * @var Swift_Mailer
     */
    private $swiftMailer;
    private $templating;
    private $router;
    private $parameters;

    public function __construct(
        Swift_Mailer $swiftMailer,
        EngineInterface $templating,
        RouterInterface $router,
        array $parameters
    )
    {
        $this->swiftMailer = $swiftMailer;
        $this->templating = $templating;
        $this->router = $router;
        $this->parameters = $parameters;
    }

    public function sendConfirmationEmailMessage(UserToken $userToken)
    {
        $user = $userToken->getUser();

        $confirmationUrl = $this->router->generate('confirm', [
            'username' => $user->getDisplayName(),
            'token' => (string) $userToken->getUUID()
        ], RouterInterface::ABSOLUTE_URL);

        $htmlTemplate = $this->templating->render(
            'emails\account_activation.html.twig',
            ['name' => $user->getDisplayName(), 'confirmationURL' => $confirmationUrl]
        );

        $this->sendMessage(self::SUBJECT_ACTIVATION, $user->getEmail(), $htmlTemplate);
    }

    private function sendMessage(string $subject, $recipientEmail, string $htmlTemplate)
    {
        $senderMail = [$this->parameters['sender_email']['address'] => $this->parameters['sender_email']['name']];

        $message = (new Swift_Message($subject))
            ->setFrom($senderMail)
            ->setTo($recipientEmail)
            ->setBody($htmlTemplate, 'text/html');

        $this->swiftMailer->send($message);
    }
}