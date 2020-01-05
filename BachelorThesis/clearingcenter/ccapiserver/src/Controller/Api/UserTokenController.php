<?php

namespace App\Controller\Api;

use Sensio\Bundle\FrameworkExtraBundle\Configuration as ConfExtra;
use Symfony\Component\HttpFoundation\{
    JsonResponse,
    Request
};

use App\Service\{
    UserTokenService,
    UserService
};
use App\Entity\UserToken;
use App\Exception\InvalidTokenException;


class UserTokenController extends ApiController
{
    /**
     * @var UserService
     */
    private $userService;
    /**
     * @var UserTokenService
     */
    private $userTokenService;

    public function __construct(
        UserTokenService $userTokenService,
        UserService $userService
    )
    {
        $this->userTokenService = $userTokenService;
        $this->userService = $userService;
    }

    /**
     * @ConfExtra\Route("/api/tokens/verify", name="user_account_activation", methods={"PATCH"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_ANONYMOUSLY')")
     * @param Request $request
     *
     * @throws \Exception
     * @return JsonResponse
     */
    public function activate(Request $request): JsonResponse
    {
        try {
            $username = $request->get('username');
            $token = $request->get('token');

            $userToken = $this->userTokenService->getExistingToken($username, $token, UserToken::TYPE_ACCOUNT_ACTIVATION);

            if ($userToken->getUsedAt() !== null) {
                return new JsonResponse(['message' => 'Token is already used.'], JsonResponse::HTTP_GONE);
            }

            if ($userToken->isExpired()) {
                return new JsonResponse(['message' => 'Token is expired.'], JsonResponse::HTTP_GONE);
            }
            $this->userService->activateUserAccount($userToken->getUser());

            $this->userTokenService->removeUnusedToken($userToken);

            return $this->respond(array('message' => "Successfully registered"));

        } catch (InvalidTokenException $e)
        {
            return new JsonResponse(['message' => 'Not valid token.'], JsonResponse::HTTP_NOT_FOUND);
        }
    }

}