<?php

namespace App\Controller\Api;

use App\Exception\BadParameterException;
use App\Utils\CriteriaSystem;
use Doctrine\Common\Collections\Criteria;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as ConfExtra;
use Symfony\Component\HttpFoundation\{
    JsonResponse,
    Request
};
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

use App\Service\{StrategyService, IndicatorService, CryptoSignalService, StrategyStatisticsService};
use App\Entity\{
    StrategyStatistics,
    User,
    CryptoSignal
};
use App\Repository\StrategyRepository;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class StrategyController extends ApiController
{
    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;
    /**
     * @var StrategyService
     */
    private $strategyService;
    /**
     * @var CryptoSignalService
     */
    private $signalService;
    /**
     * @var StrategyRepository
     */
    private $strategyRepository;
    /**
     * @var IndicatorService
     */
    private $indicatorService;
    /**
     * @var StrategyStatisticsService
     */
    private $strategyStatisticsService;

    public function __construct(
        TokenStorageInterface $tokenStorage,
        StrategyService $strategyService,
        CryptoSignalService $signalService,
        IndicatorService $indicatorService,
        StrategyRepository $strategyRepository,
        StrategyStatisticsService $strategyStatisticsService
    )
    {
        $this->tokenStorage = $tokenStorage;
        $this->strategyService = $strategyService;
        $this->signalService = $signalService;
        $this->indicatorService = $indicatorService;
        $this->strategyRepository = $strategyRepository;
        $this->strategyStatisticsService = $strategyStatisticsService;
    }

    /**
     * @ConfExtra\Route("/api/strategies", name="get_all_stategies", methods={"GET"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_FULLY')")
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $strategies = $this->strategyRepository->findAll();
        $response = [];
        if (empty($strategies))
        {
            $response['strategies'] = array();
        }

        foreach ($strategies as $strategy) {
            $response['strategies'][] = [
                'id' => $strategy->getID(),
                'name' => $strategy->getName(),
                'author' => $strategy->getCreator()->getDisplayName(),
                'type' => $strategy->getType(),
                'followers' => count($strategy->getFollowedByInfo()),
                'performance' => round($strategy->getStatistics()->getTotalPerformance(), 2),
                'market' => $strategy->getMarket()->getStrRepresentation(),
            ];
        }
        return new JsonResponse($response);
    }

    /**
     * @ConfExtra\Route("/api/strategies", name="create_new_strategy", methods={"POST"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_FULLY')")
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function createStrategy(Request $request): JsonResponse
    {
        /* @var User $ownerUser */
        $ownerUser = $this->tokenStorage->getToken()->getUser();

        $body = (array) json_decode($request->getContent(), true);

        try {
            $strategy = $this->strategyService->createStrategy($body, $ownerUser);

        } catch(BadParameterException $e) {
            $response = ['message' => $e->getMessage()];
            return new JsonResponse($response, JsonResponse::HTTP_CONFLICT); 
        } catch (\Doctrine\Orm\ORMException $e) {
            throw new HttpException(422, $e->getMessage());
        }

        $response = [
            'id' => $strategy->getId(),
            'API_KEY' => $strategy->getApiKey(),
        ];
        return new JsonResponse($response, JsonResponse::HTTP_CREATED);
    }

    /**
     * @ConfExtra\Route("/api/strategies/{id}", name="edit_own_strategy", methods={"PATCH"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_FULLY')")
     *
     * @param string $id
     * @param Request $request
     * @return JsonResponse
     */
    public function editStrategy(string $id, Request $request): JsonResponse
    {
        try {
            /* @var User $user */
            $user = $this->tokenStorage->getToken()->getUser();
            $strategy = $this->strategyService->findStrategyById($id);

            // if strategy with such id belongs to user => change strategy info
            if (!$this->strategyService->isStrategyOwner($user,$strategy))
            {
                throw new AccessDeniedException("User without owner permissions can't edit related strategy");
            }

            $body = (array) json_decode($request->getContent(), true);
            $this->strategyService->updateStrategyFields($strategy, $body);
            return new JsonResponse();

        } catch (BadParameterException $e) {
            $response = ['message' => $e->getMessage()];
            return new JsonResponse($response, JsonResponse::HTTP_CONFLICT); 
        } catch (AccessDeniedException $e) {
            throw new HttpException(405, $e->getMessage());
        } catch (\Doctrine\Orm\ORMException $e){
            throw new HttpException($e->getCode(), $e->getMessage());
        }
    }

    /**
     * @ConfExtra\Route("/api/strategies/{id}", name="read_strategy_info", methods={"GET"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_FULLY')")
     *
     * @throws \Exception
     * @param string $id
     * @return JsonResponse
     */
    public function strategyProfile(string $id): JsonResponse
    {
        /* @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();

        try {
            $strategy = $this->strategyService->findStrategyById($id);
            $market = $strategy->getMarket();
            $response = [
                'name' => $strategy->getName(),
                'author' => $strategy->getCreator()->getDisplayName(),
                'type' => $strategy->getType(),
                'about' => $strategy->getAbout(),
                'market' => $market->getStrRepresentation(),
                'fee' => $strategy->getMakerFee(),
            ];

            $response['indicators'] = $this->indicatorService->getIndicatorsAbr($strategy->getIndicators());
            $this->strategyService->setParamsForOwnerOrFollower($response, $strategy, $user);


            $strategyStatistics = $strategy->getStatistics();
            $baseCurrency = $market->getMarketPair()->getCurrency();

            $statistics = $this->strategyStatisticsService->getStrategyStatisticsPortfolio($strategyStatistics, $baseCurrency);
            $statistics['timeInMarket'] = $this->strategyService->getLivenessInMarket($strategy);

            $response['statistics'] = $statistics;

            return new JsonResponse($response);

        } catch (BadParameterException $e)
        {
            throw new HttpException($e->getCode(), $e->getMessage());
        }
        catch (\Exception $e)
        {
            throw new HttpException($e->getCode(), $e->getMessage());
        }
    }

    /**
     * @ConfExtra\Route("/api/strategies/{id}/follow", name="follow_or_unfollow_strategy", methods={"POST"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_FULLY')")
     *
     * @param string $id
     * @param Request $request
     * @return JsonResponse
     */
    public function followUnfollowStrategy(string $id, Request $request): JsonResponse
    {
        /* @var User $user */
        try {
            $user = $this->tokenStorage->getToken()->getUser();
            $strategy = $this->strategyService->findStrategyById($id);

            $body = (array) json_decode($request->getContent(), true);
            $followAction = $body['follow'];
            $this->strategyService->makeFollowUnfollowAction($user, $strategy, $followAction);

            return new JsonResponse();
        } catch (BadParameterException $e) {
            throw new HttpException($e->getCode(), $e->getMessage());
        } catch (\Doctrine\ORM\ORMException $e){
            throw new HttpException($e->getCode(), $e->getMessage());
        }
    }

    /**
     * @ConfExtra\Route("/api/strategies/{id}/subscribe", name="subscribe_or_unsubscribe_strategy", methods={"POST"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_FULLY')")
     *
     * @param string $id
     * @param Request $request
     * @return JsonResponse
     */
    public function subscribeUnsubscripeStrategy(string $id, Request $request): JsonResponse
    {
        /* @var User $user */
        try {
            $user = $this->tokenStorage->getToken()->getUser();
            $strategy = $this->strategyService->findStrategyById($id);

            $body = (array) json_decode($request->getContent(), true);
            $subscribeAction = $body['subscribe'];
            $this->strategyService->makeSubscribeUnsubscribeAction($user, $strategy, $subscribeAction);

            return new JsonResponse();
        } catch (BadParameterException $e) {
            throw new HttpException($e->getCode(), $e->getMessage());
        } catch (\Doctrine\ORM\ORMException $e){
            throw new HttpException($e->getCode(), $e->getMessage());
        }
    }

    /**
     * @ConfExtra\Route("/api/followingstrategies", name="read_all_following_strategies", methods={"GET"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_FULLY')")
     *
     * @return JsonResponse
     */
    public function followingStrategies(): JsonResponse
    {
        /* @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();
        $response = [];
        if ($user->getFollowingStrategiesInfo()->isEmpty())
        {
            $response['strategies'] = array();
        }

        // find all strategies followed by user ($user->getFollowing())
        foreach ($user->getFollowingStrategiesInfo() as $followingInfo) {
            $followedStrategy = $followingInfo->getStrategy();
            $response['strategies'][] = [
                'id' => $followedStrategy->getID(),
                'name' => $followedStrategy->getName(),
                'author' => $followedStrategy->getCreator()->getDisplayName(),
                "type" => $followedStrategy->getType(),
                "followers" => count($followedStrategy->getFollowedByInfo()),
                "performance" => round($followedStrategy->getStatistics()->getTotalPerformance(), 2),
                "market" => $followedStrategy->getMarket()->getStrRepresentation(),
                "subscribe" => $followingInfo->getSubscription()
            ];
        }
        return new JsonResponse($response);
    }

    /**
     * @ConfExtra\Route("/api/mystrategies", name="read_all_self_made_strategies", methods={"GET"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_FULLY')")
     *
     * @return JsonResponse
     */
    public function ownedStrategies(): JsonResponse
    {
        /* @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();
        $response = [];
        if ($user->getMyStrategies()->isEmpty())
        {
            $response['strategies'] = array();
        }

        // find all strategies owned by user ($user->getOwned())
        foreach ($user->getMyStrategies() as $myStrategy) {
            $response['strategies'][] = [
                'id' => $myStrategy->getID(),
                'name' => $myStrategy->getName(),
                "followers" => count($myStrategy->getFollowedByInfo()),
                'API' => $myStrategy->getApiKey(),
            ];
        }
        return new JsonResponse($response);
           }

    /**
     * @ConfExtra\Route("/api/strategies/{id}/graph", name="read_required_graph_info", methods={"GET"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_FULLY')")
     *
     * @param string $id
     * @return JsonResponse
     */
    public function tradeGraph(string $id): JsonResponse
    {
        try{
            $strategy = $this->strategyService->findStrategyById($id);
            $strategyCandles = $strategy->getCandles(
                CriteriaSystem::createOrderByCriteria('timestamp', Criteria::ASC));
            $strategySignals = $strategy->getSignals();

            if ($strategyCandles->isEmpty())
            {
                $response['candles'] = array();
            } else {
                $candlesticksData = $this->signalService->mapSignalsToCandleSticksGraph($strategyCandles, $strategySignals);
                $response['candles'] = $candlesticksData;
            }

            return new JsonResponse($response);

        } catch (BadParameterException $e){
            throw new HttpException(403, $e->getMessage());
        }
    }
}