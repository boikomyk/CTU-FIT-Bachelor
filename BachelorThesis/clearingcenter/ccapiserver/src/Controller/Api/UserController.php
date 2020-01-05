<?php

namespace App\Controller\Api;

use App\Entity\User;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as ConfExtra;

use Symfony\Component\HttpFoundation\{JsonResponse, Request};

use Symfony\Component\HttpKernel\Exception\HttpException;
use App\Exception\{BadParameterException, InvalidEmailFormatException};

use App\Service\{UserService, UserTokenService};
use App\Entity\UserToken;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class UserController extends ApiController
{
    /**
     * @var UserService
     */
    private $userService;
    /**
     * @var UserTokenService
     */
    private $userTokenService;
    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;


    public function __construct(
        UserService $userService,
        UserTokenService $userTokenService,
        TokenStorageInterface $tokenStorage
    )
    {
        $this->userService = $userService;
        $this->userTokenService = $userTokenService;
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * @ConfExtra\Route("/api/user", name="user_read", methods={"GET"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_FULLY')")
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        /* @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();

        return new JsonResponse([
            'username' => $user->getDisplayName(),
            'email' => $user->getEmail(),
            'lastLoginAt' => (string)$user->getLastLoginAt(DATE_ATOM),
        ]);
    }

    /**
     * @ConfExtra\Route("/api/register", name="user_creation", methods={"POST"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_ANONYMOUSLY')")
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function create(Request $request): JsonResponse
    {
        $body = (array) json_decode($request->getContent(), true);

        try {
            if (!filter_var($body['email'], FILTER_VALIDATE_EMAIL)) {
                throw new InvalidEmailFormatException();
            }

            $user = $this->userService->create($body['username'], $body['password'], $body['email']);

            $this->userTokenService->createToken($user, UserToken::TYPE_ACCOUNT_ACTIVATION);

            return new JsonResponse(['message' => 'Successfully registered.'], JsonResponse::HTTP_CREATED);

        } catch (InvalidEmailFormatException $e) {
            $response = ['message' => $e->getMessage()];
            return new JsonResponse($response, $e->getCode());  
        } catch(BadParameterException $e) {
            $response = ['message' => $e->getMessage()];
            return new JsonResponse($response, $e->getCode()); 
        } catch (\Doctrine\ORM\ORMException $e) {
            throw new HttpException(422, $e->getMessage());
        } catch (\Exception $e) {
            throw new HttpException(400, "Server internal problems");
        }
    }
}