<?php
namespace App\Security\Websocket;


use Exception;
use Lexik\Bundle\JWTAuthenticationBundle\Security\Authentication\Token\JWTUserToken;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use React\EventLoop\LoopInterface;
use Symfony\Component\Security\Csrf\CsrfTokenManager;
use Thruway\Authentication\AbstractAuthProviderClient;
use Symfony\Component\Security\Csrf\CsrfToken;
use Thruway\Logging\Logger;
use Thruway\Message\HelloMessage;

class AuthenticationProvider extends AbstractAuthProviderClient
{

    const CSRF_TOKEN_KEY = 'x-xsrf-token';

    /**
     * @return JWTTokenManagerInterface
     */
    private $JWTTokenManager;

    /**
     * @return CsrfTokenManager
     */
    private $csrfTokenManager;

    /**
     * Constructor
     *
     * @param array $authRealms
     * @param JWTTokenManagerInterface $jwtManager
     * @param CsrfTokenManager $csrfTokenManager
     * @param LoopInterface|null $loop
     */
    public function __construct
    (
        array $authRealms,
        JWTTokenManagerInterface $jwtManager,
        CsrfTokenManager $csrfTokenManager,
        LoopInterface $loop = null
    )
    {
        parent::__construct($authRealms, $loop);
        $this->JWTTokenManager = $jwtManager;
        $this->csrfTokenManager = $csrfTokenManager;
    }



    /**
     * @return string
     */
    public function getMethodName()
    {
        return "jwt";
    }


    /**
     * Pre process AuthenticateMessage
     * Extract and validate arguments
     *
     * @param array $args
     * @return array
     * @throws \Thruway\Message\MessageException
     * @throws Exception
     */
    public function preProcessAuthenticate(array $args)
    {

        $args = $args[0];
        $csrf = isset($args->signature) ? $args->signature : null;
        $jwt = null;
        if(isset($args->extra)) {
            $helloMsg = HelloMessage::createMessageFromArray($args->hello_message);
            $jwt = $helloMsg->getDetails()->transport->headers->Cookie[0];
        }

        if (!$csrf || !$jwt) {
            return ['ERROR'];
        }

        return $this->processAuthenticate($csrf, explode('=', $jwt, 2)[1]);
    }


    /**
     * Process authenticate
     *
     * @param $csrf
     * @param null $jwt
     * @return array
     * @throws Exception
     */
    public function processAuthenticate($csrf, $jwt = null)
    {
        $token = new JWTUserToken();
        $token->setRawToken($jwt);
        $payload = $this->JWTTokenManager->decode($token);
        $authId = $payload["email"];

        $csrfWebTokenSavedInJwt = $payload[self::CSRF_TOKEN_KEY];

        if ($csrfWebTokenSavedInJwt !== $csrf) {
            return ["FAILURE"];
        }

        $details = [
            "authid" => $authId
        ];

        return ["SUCCESS", $details];
    }
}