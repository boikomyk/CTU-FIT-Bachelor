<?php

namespace App\Controller\Api;

use Sensio\Bundle\FrameworkExtraBundle\Configuration as ConfExtra;

use App\Exception\InvalidCandleException;
use App\Service\{
    CryptoSignalService,
    StrategyService,
    CandleService,
    StrategyStatisticsService,
    TransactionService
};
use Symfony\Component\HttpFoundation\{
    JsonResponse,
    Request
};
use Symfony\Component\HttpKernel\Exception\{
    BadRequestHttpException,
    HttpException
};

class CandleController extends ApiController
{
    /**
     * @var StrategyService
     */
    private $strategyService;
    /**
     * @var CandleService
     */
    private $candleService;
    /**
     * @var CryptoSignalService
     */
    private $signalService;
    /**
     * @var TransactionService
     */
    private $transactionService;
    /**
     * @var StrategyStatisticsService
     */
    private $strategyStatisticsService;

    public function __construct(
        StrategyService $strategyService,
        CandleService $candleService,
        CryptoSignalService $signalService,
        TransactionService $transactionService,
        StrategyStatisticsService $strategyStatisticsService
    )
    {
        $this->strategyService = $strategyService;
        $this->candleService = $candleService;
        $this->signalService = $signalService;
        $this->transactionService = $transactionService;
        $this->strategyStatisticsService = $strategyStatisticsService;
    }

    /**
     * @ConfExtra\Route("/api/candles/{apiToken}/dev", name="receive_candles_from_strategy_developer",
     *     requirements={"apiToken"=".{32}"}, methods={"POST"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_ANONYMOUSLY')")
     *
     * @param Request $request
     * @param string $apiToken
     *
     * @return JsonResponse
     */
    public function receiveCandlesFromDeveloper(Request $request, string $apiToken): JsonResponse
    {
        try {
            $strategy = $this->strategyService->findStrategyByApiKey($apiToken);

            $body = (array) json_decode($request->getContent(), true);
            if (!isset($body['candle']))
            {
                throw new BadRequestHttpException("Missing required parameters in json body");
            }

            $receivedCandle = $this->candleService->proceedReceivedCandle($strategy, $body['candle']);
            if (($expiredSignal = $this->signalService->getSignalWithExpiredValidity($strategy, $receivedCandle->getTimestamp()))
                !== null)
            {
                $action = $expiredSignal->getAction();
                $askPrice = $expiredSignal->getAsk();
                $statisticsToActualize = $strategy->getStatistics();
                $this->strategyStatisticsService->actualizeStatisticsInfo($statisticsToActualize, $action, $askPrice);

                $this->transactionService->startApprovedTransactionProcess($expiredSignal);
            }
            return new JsonResponse();
        }
        catch (BadRequestHttpException $e) {
            throw new HttpException(400, $e->getMessage());
        } catch (InvalidCandleException $e) {
            throw new HttpException($e->getCode(), $e->getMessage());
        } catch (\Exception $e) {
            throw new HttpException($e->getCode(), $e->getMessage());
        }
    }


}
