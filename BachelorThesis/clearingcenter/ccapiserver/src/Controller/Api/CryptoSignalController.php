<?php

namespace App\Controller\Api;

use App\Entity\CryptoSignal;
use App\Exception\BadParameterException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as ConfExtra;
use Symfony\Component\HttpFoundation\{
    JsonResponse,
    Request
};
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

use App\Entity\User;

use App\Service\{CryptoSignalService,
    StrategyService,
    FollowingInfoService,
    TransactionService,
    Websocket\PublisherService};


class CryptoSignalController extends ApiController
{
    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;
    /**
     * @var CryptoSignalService
     */
    private $signalService;
    /**
     * @var StrategyService
     */
    private $strategyService;
    /**
     * @var FollowingInfoService
     */
    private $followingInfoService;
    /**
     * @var TransactionService
     */
    private $transactionService;
    /**
     * @var PublisherService
     */
    private $publisherService;

    public function __construct(
        TokenStorageInterface $tokenStorage,
        CryptoSignalService $signalService,
        StrategyService $strategyService,
        FollowingInfoService $followingInfoService,
        TransactionService $transactionService,
        PublisherService $publisherService
    )
    {
        $this->tokenStorage = $tokenStorage;
        $this->signalService = $signalService;
        $this->strategyService = $strategyService;
        $this->followingInfoService = $followingInfoService;
        $this->transactionService = $transactionService;
        $this->publisherService = $publisherService;
    }

    /**
     * @ConfExtra\Route("/api/signals/purchased", name="read_purchased_signals", methods={"GET"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_FULLY')")
     *
     * @return JsonResponse
     */
    public function purchasedSignals(): JsonResponse
    {
        // get all pursed user's signals
        /* @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();
        $response['signals'] = array();

        /* @var array|CryptoSignal[] $purchasedSignals*/
        $purchasedSignals = $this->signalService->getUserPurchasedSignals($user);

        foreach ($purchasedSignals as $purchasedSignal)
        {
            $response['signals'][] = $this->signalService->prepareRelatedInfoToPurchasedSignal($purchasedSignal);
        }
        return new JsonResponse($response);
    }

    /**
     * @ConfExtra\Route("/api/signals/strategy/{id}", name="read_signals_for_strategy", methods={"GET"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_FULLY')")
     *
     * @param string $id
     * @return JsonResponse
     */
    public function strategySignals(string $id): JsonResponse
    {
        try {
            $strategy = $this->strategyService->findStrategyById($id);
            $strategySignals = $strategy->getSignals();
            $response = [];

            foreach ($strategySignals as $signal)
            {
                if ($signal->getState() === CryptoSignal::STATE_OPEN)
                {
                    break;
                }

                $action = $this->signalService->getActionType($signal->getAction());
                $type = $this->signalService->getTradeType($signal->getType());
                $response['signals'][] = [
                    'timestamp' => $signal->getTimestamp(DATE_ATOM),
                    'market' => $strategy->getMarket()->getStrRepresentation(),
                    'action' => $action . ' ' . $type,
                ];

            }
            if (empty($response))
            {
                $response['signals'] = array();
            }

            return new JsonResponse($response);

        } catch (BadParameterException $e){
            throw new HttpException(403, $e->getMessage());
        }
    }

    /**
     * @ConfExtra\Route("/api/signals/{apiToken}/dev", name="receive_signals_from_strategy_developer",
     *     requirements={"apiToken"=".{32}"}, methods={"POST"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_ANONYMOUSLY')")
     *
     * @param Request $request
     * @param string $apiToken
     *
     * @return JsonResponse
     */
    public function receiveSignalsFromDeveloper(Request $request, string $apiToken): JsonResponse
    {
        try {
            $strategy = $this->strategyService->findStrategyByApiKey($apiToken);

            $body = (array) json_decode($request->getContent(), true);
            if (!isset($body['signal']))
            {
                throw new BadRequestHttpException("Missing required parameters in json body");
            }
            // need to store received signal in db even in case of zero subscribers (required by graph, statistics, etc)
            $receivedSignal = $this->signalService->proceedReceivedSignal($strategy, $body['signal']);

            $userToNotify = $this->transactionService->startUnprovedTransactionProcess($receivedSignal, $strategy);

            // notify all users successfully purchased current proceeded signal
            if (!empty($userToNotify))
            {
                $this->publisherService->publish(
                    $userToNotify, $this->signalService->prepareRelatedInfoToPurchasedSignal($receivedSignal));
            }
            return new JsonResponse();
        }
        catch (BadParameterException $e) {
            throw new HttpException(403, $e->getMessage());
        } catch (BadRequestHttpException $e) {
            throw new HttpException(400, $e->getMessage());
        } catch (\Doctrine\Orm\ORMException $e) {
            throw new HttpException(400, $e->getMessage());
        } catch (\Exception $e) {
            throw new HttpException($e->getCode(), $e->getMessage());
        }
    }

    /**
     * @ConfExtra\Route("/api/signals/mock", name="mocktester", methods={"GET"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_ANONYMOUSLY')")
     *
     * @return JsonResponse
     * @throws \Exception
     */
    public function mockTester(): JsonResponse
    {
        $fakeSignal =  [
            'timestamp' => '2019-02-28T23:00:00+00:00',
            "market" => "Binance ETH/BTC",
            'action' => 'Sell LONG',
        ];
        $fakeUsernames = [
            "dummy@dummy.com",
            "root@root.com",
            "andrew@gmail.com"
        ];

        $this->publisherService->publish($fakeUsernames,$fakeSignal);
        return new JsonResponse([], JsonResponse::HTTP_ACCEPTED);
    }

}