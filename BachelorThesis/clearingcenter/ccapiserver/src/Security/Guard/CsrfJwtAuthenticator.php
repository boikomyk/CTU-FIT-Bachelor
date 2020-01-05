<?php
namespace App\Security\Guard;

use Lexik\Bundle\JWTAuthenticationBundle\Exception\ExpiredTokenException;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\InvalidTokenException;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTDecodeFailureException;
use Lexik\Bundle\JWTAuthenticationBundle\Security\Authentication\Token\PreAuthenticationJWTUserToken;
use Lexik\Bundle\JWTAuthenticationBundle\Security\Guard\JWTTokenAuthenticator as BaseAuthenticator;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\TokenExtractor\AuthorizationHeaderTokenExtractor;
use Lexik\Bundle\JWTAuthenticationBundle\TokenExtractor\CookieTokenExtractor;
use Lexik\Bundle\JWTAuthenticationBundle\TokenExtractor\TokenExtractorInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;
use Symfony\Component\Security\Core\Exception\InvalidCsrfTokenException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use App\Entity\User;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

class CsrfJwtAuthenticator extends BaseAuthenticator
{
    const API_PATTERN = '/\bapi\b/';

    /**
     * @var AuthorizationHeaderTokenExtractor
     */
    private $csrftokenExtracter;
    /**
     * @var CsrfTokenManagerInterface
     */
    private $csrfTokenManager;
    /**
     * @param JWTTokenManagerInterface $jwtManager
     * @param EventDispatcherInterface $dispatcher
     * @param TokenExtractorInterface  $tokenExtractor
     *
     * {@inheritdoc}
     */
    public function __construct(
        JWTTokenManagerInterface $jwtManager,
        CsrfTokenManagerInterface $csrfTokenManager,
        EventDispatcherInterface $dispatcher
    )
    {
        parent::__construct($jwtManager, $dispatcher, new CookieTokenExtractor('access_token'));
        $this->csrftokenExtracter = new AuthorizationHeaderTokenExtractor('','x-xsrf-token');
        $this->csrfTokenManager = $csrfTokenManager;
    }

    /**
     *
     * {@inheritdoc}
     *
     * @param Request $request
     *
     * @return bool
     */
    public function supports(Request $request)
    {
        $isApiUrl = preg_match(self::API_PATTERN, $request->attributes->get('_route'));
        $containJwtToken = $this->getTokenExtractor()->extract($request);
        $containCsrfToken = $this->csrftokenExtracter->extract($request);

        return (false !== $isApiUrl and false !== $containJwtToken and false !== $containCsrfToken);
    }

    /**
     *
     * {@inheritdoc}
     * @param Request $request
     *
     * @return PreAuthenticationJWTUserToken
     *
     * @throws InvalidTokenException If an error occur while decoding the token
     * @throws ExpiredTokenException If the request token is expired
     */
    public function getCredentials(Request $request)
    {
        # proceeding of JWT token
        $preAuthToken = parent::getCredentials($request);

        # proceeding of CSRF token
        if (false === ($csrfWebToken = $this->csrftokenExtracter->extract($request))) {
            throw new InvalidTokenException('CSRF token is missing');
        }

        $tokenId = $preAuthToken->getPayload()['email'];
        if ($this->csrfTokenManager->isTokenValid(new CsrfToken($tokenId, $csrfWebToken)))
        {
            throw new InvalidTokenException('Invalid CSRF token.');
        }

        $csrfWebTokenSavedInJwt = $preAuthToken->getPayload()['x-xsrf-token'];
        if ($csrfWebTokenSavedInJwt !== $csrfWebToken) {
            throw new InvalidTokenException('CSRF tokens\'re different.');
        }

        return $preAuthToken;
    }

    /**
     * {@inheritdoc}
     *
     * @throws AuthenticationException
     */
    public function checkCredentials($credentials, UserInterface $user): bool
    {

        $payload = $credentials->getPayload();
        if ($payload['role'] !== $user->getRole()) {
            throw new AuthenticationException();
        }
        $statuses = [User::STATUS_INACTIVE, User::STATUS_CLOSED, User::STATUS_BLOCKED];
        if (in_array($user->getStatus(), $statuses)) {
            throw new AuthenticationException();
        }
        return true;
    }

}