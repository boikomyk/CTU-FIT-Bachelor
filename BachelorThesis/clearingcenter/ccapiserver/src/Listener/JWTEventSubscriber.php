<?php
namespace App\Listener;

use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Lexik\Bundle\JWTAuthenticationBundle\Event\{JWTCreatedEvent, JWTFailureEventInterface};

use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

class JWTEventSubscriber implements EventSubscriberInterface
{
    private $csrfTokenManager;
    private $csrfTokenStorage;

    public function __construct(
        CsrfTokenManagerInterface $csrfTokenManager
    )
    {
        $this->csrfTokenManager = $csrfTokenManager;
    }
    /**
     * {@inheritdoc}
     */
    public static function getSubscribedEvents(): array
    {
        return [
            Events::JWT_CREATED => 'onJWTCreated',
            Events::JWT_NOT_FOUND => 'onJWTFailure',
            Events::JWT_INVALID => 'onJWTFailure',
            Events::JWT_EXPIRED => 'onJWTFailure',
        ];
    }
    /**
     * @param JWTCreatedEvent $event
     *
     * @return void
     */
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        /* @var User $user*/
        $user = $event->getUser();
        $csrfToken = $this->csrfTokenManager->getToken($user->getEmail());

        $payload = [
            'email' => $user->getEmail(), // identity field
            'role' => $user->getRole(),
            'status' => $user->getStatus(),
            'sub' => $user->getID(),
            'x-xsrf-token' => $csrfToken->getValue()
        ];
        $event->setData($payload);
    }
    /**
     * @param JWTFailureEventInterface $event
     *
     * @return void
     */
    public function onJWTFailure(JWTFailureEventInterface $event)
    {
        $response = ['message' => 'JWT is not found, invalid or expired.'];
        $event->setResponse(new JsonResponse($response, JsonResponse::HTTP_UNAUTHORIZED, ['WWW-Authenticate' => 'Bearer']));
    }
}