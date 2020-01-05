<?php

namespace App\Controller\Api;

use App\Entity\Transaction;
use App\Utils\CriteriaSystem;
use Doctrine\Common\Collections\Criteria;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as ConfExtra;
use Symfony\Component\HttpFoundation\{
    JsonResponse,
    Request
};
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

use App\Service\{
    UserWalletService,
    TransactionService
};
use App\Entity\User;

class WalletController extends ApiController
{
    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;
    /**
     * @var UserWalletService
     */
    private $userWalletService;
    /**
     * @var TransactionService
     */
    private $transactionService;

    public function __construct(
        TokenStorageInterface $tokenStorage,
        UserWalletService $userWalletService,
        TransactionService $transactionService
    )
    {
        $this->tokenStorage = $tokenStorage;
        $this->userWalletService = $userWalletService;
        $this->transactionService = $transactionService;
    }

    /**
     * @ConfExtra\Route("/api/wallet", name="read_wallet_info", methods={"GET"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_FULLY')")

     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        /* @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();
        $response = [];

        $userWallet = $user->getWallet();
        $response['availableBalance'] = $userWallet->getTotalBalance();
        $response['frozenBalance'] = $userWallet->getFrozenBalance();
        $response['transactions'] = array();

        $transactionHistory = $userWallet->getTransactionHistory(CriteriaSystem::createOrderByCriteria(
            'id', Criteria::DESC));
        if (!$transactionHistory->isEmpty())
        {
            $response['transactions'] = $this->transactionService->prepareTransactionHistory($transactionHistory);
        }
        return new JsonResponse($response);
    }

    /**
     * @ConfExtra\Route("/api/wallet", name="top_up_wallet_balance", methods={"POST"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_FULLY')")
     *
     * @param Request $request
     * @throws \Doctrine\ORM\ORMException
     *
     * @return JsonResponse
     */
    public function topUpBalance(Request $request): JsonResponse
    {
        /* @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();
        $wallet = $user->getWallet();

        $body = (array) json_decode($request->getContent(), true);
        $amount = $body['amount'];

        $balance = $this->userWalletService->increaseBalance($wallet, $amount);

        return new JsonResponse(array('balance' => $balance) ,
            200);
    }
}