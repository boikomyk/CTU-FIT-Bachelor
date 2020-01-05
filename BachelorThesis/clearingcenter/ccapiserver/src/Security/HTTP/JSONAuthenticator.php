<?php

namespace App\Security\HTTP;

use DateTimeImmutable;
use App\Entity\User;
use App\Repository\UserRepository;

use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

use Symfony\Component\Security\Core\Authentication\Token\{
    PreAuthenticatedToken,
    TokenInterface
};
use Symfony\Component\Security\Http\Authentication\{
    SimplePreAuthenticatorInterface,
    AuthenticationSuccessHandlerInterface,
    AuthenticationFailureHandlerInterface
};
use Symfony\Component\HttpFoundation\{
    JsonResponse,
    Request,
    Response,
    Cookie
};
use Symfony\Component\Security\Core\Exception\{
    AuthenticationException,
    BadCredentialsException,
    UsernameNotFoundException
};

class JSONAuthenticator implements SimplePreAuthenticatorInterface, AuthenticationSuccessHandlerInterface, AuthenticationFailureHandlerInterface
{
    const CSRF_TOKEN_KEY = 'x-xsrf-token';
    const JWT_TOKEN_KEY = 'access_token';

    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;
    /**
     * @var JWTTokenManagerInterface
     */
    private $jwtTokenManager;
    /**
     * @var CsrfTokenManagerInterface
     */
    private $csrfTokenManager;
    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @param UserPasswordEncoderInterface $encoder
     * @param JWTTokenManagerInterface $jwtTokenManager
     * @param CsrfTokenManagerInterface $csrfTokenManager
     * @param UserRepository $userRepository
     */
    public function __construct(
        UserPasswordEncoderInterface $encoder,
        JWTTokenManagerInterface $jwtTokenManager,
        CsrfTokenManagerInterface $csrfTokenManager,
        UserRepository $userRepository
    )
    {
        $this->encoder = $encoder;
        $this->jwtTokenManager = $jwtTokenManager;
        $this->csrfTokenManager = $csrfTokenManager;
        $this->userRepository = $userRepository;
    }

    /**
     * This is called when an interactive authentication attempt fails. This is
     * called by authentication listeners inheriting from
     * AbstractAuthenticationListener.
     *
     * @return JsonResponse The response to return, never null
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): JsonResponse
    {
        $response = ['message' => $exception->getMessage()];
        return new JsonResponse($response, JsonResponse::HTTP_UNAUTHORIZED, ['WWW-Authenticate' => 'Bearer']);
    }

    /**
     * {@inheritdoc}
     * @param Request $request
     * @param TokenInterface $token
     * This is called when an interactive authentication attempt succeeds. This
     * is called by authentication listeners inheriting from
     * AbstractAuthenticationListener.
     *
     * @return JsonResponse never null
     * @throws \Exception
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token): JsonResponse
    {
        /* @var User $user */
        $user = $token->getUser();
        $user->setLastLoginAt(new DateTimeImmutable());
        $this->userRepository->update($user);

        $jwtToken = $this->jwtTokenManager->create($user);
        $csrfToken = $this->csrfTokenManager->getToken($user->getUsername())->getValue();

        $response = new JsonResponse();
        $response->headers->set(self::CSRF_TOKEN_KEY, $csrfToken);
        $response->headers->setCookie(Cookie::create(self::JWT_TOKEN_KEY, $jwtToken, time()+60*60*24,
            '/', null, false, true));

        return $response->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * {@inheritdoc}
     *
     * creation of a token object that contains all of the information from the request that you need to authenticate the user
     * @throws BadCredentialsException
     */
    public function createToken(Request $request, $providerKey): PreAuthenticatedToken
    {
        $credentials = (array) json_decode($request->getContent(), true);

        if (!isset($credentials['email'], $credentials['password'])) {
            throw new BadCredentialsException();
        }
        return new PreAuthenticatedToken($credentials['email'], $credentials, $providerKey);
    }

    /**
     * {@inheritdoc}
     *
     * After Symfony calls createToken(), it will then call supportsToken() on your class
     * (and any other authentication listeners) to figure out who should handle the token.
     */
    public function supportsToken(TokenInterface $token, $providerKey): bool
    {
        return $token instanceof PreAuthenticatedToken && $token->getProviderKey() === $providerKey;
    }

    /**
     * {@inheritdoc}
     *
     * @throws AuthenticationException
     *
     * if supportsToken() returns true, Symfony will now call authenticateToken().
     */
    public function authenticateToken(TokenInterface $token, UserProviderInterface $userProvider, $providerKey): PreAuthenticatedToken
    {
        $credentials = $token->getCredentials();
        try {
            /* @var User $user */
            $user = $userProvider->loadUserByUsername($credentials['email']);
        } catch (UsernameNotFoundException $exception) {
            throw new AuthenticationException('Invalid email or password.');
        }
        if (!$this->encoder->isPasswordValid($user, $credentials['password'])) {
            throw new AuthenticationException('Invalid email or password.');
        }
        switch ($user->getStatus()) {
            case User::STATUS_INACTIVE:
                throw new AuthenticationException('Account is inactive.');
            case User::STATUS_CLOSED:
                throw new AuthenticationException('Account is closed.');
            case User::STATUS_BLOCKED:
                throw new AuthenticationException('Account is blocked.');
        }
        return new PreAuthenticatedToken($user, $credentials, $providerKey, $user->getRoles());
    }
}