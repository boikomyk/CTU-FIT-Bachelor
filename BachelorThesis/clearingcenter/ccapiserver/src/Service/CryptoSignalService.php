<?php

namespace App\Service;

use App\Entity\{Candle, CryptoSignal, Strategy, Transaction, User};
use App\Exception\InvalidCandleException;
use App\Exception\BadParameterException;
use App\Repository\CryptoSignalRepository;
use App\Utils\CriteriaSystem;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\ORMException;

use Psr\Log\LoggerInterface;

class CryptoSignalService
{
    /**
     * @var MarketService
     */
    private $marketService;
    /**
     * @var TransactionService
     */
    private $transactionService;
    /**
     * @var CryptoSignalRepository
     */
    private $signalRepository;
    /**
     * @var LoggerInterface
     */
    private $logger;


    public function __construct(
        MarketService $marketService,
        TransactionService $transactionService,
        CryptoSignalRepository $signalRepository,
        LoggerInterface $logger
    )
    {
        $this->marketService = $marketService;
        $this->transactionService = $transactionService;
        $this->signalRepository = $signalRepository;
        $this->logger = $logger;
    }

    /**
     * @param Strategy $strategy
     * @param array $signalData
     *
     * @return CryptoSignal
     *
     * @throws BadParameterException
     * @throws \Doctrine\Orm\ORMException| \Exception
     */
    public function proceedReceivedSignal(Strategy &$strategy, array $signalData): CryptoSignal
    {
        $market = $strategy->getMarket();
        if (!$this->marketService->checkIdentityOfMarketExchange($market,
            $signalData['exchange'], $signalData['currency'], $signalData['coin']))
        {
            throw new BadParameterException('Signal market data is different from strategy\' data');
        }
        $signal = new CryptoSignal();

        $signal->setTimestamp(new DateTimeImmutable($signalData['timestamp']));
        $signal->setBuyStart((float)$signalData['buy_start']);
        $signal->setBuyEnd((float)$signalData['buy_end']);
        $signal->setType($this->getTradeType(strtoupper($signalData['type'])));
        $signal->setAction($this->getActionType(strtoupper($signalData['action'])));
        $signal->setAsk($signalData['ask']);
        $signal->setRelatedStrategy($strategy);

        $this->signalRepository->add($signal);
        $strategy->addSignal($signal);

        return $signal;
    }

    /**
     * @param Strategy $strategy
     * @param DateTimeImmutable $startTimestampCandle
     *
     * @throws \Doctrine\Orm|ORMException
     * @return CryptoSignal
     */
    public function getSignalWithExpiredValidity(Strategy &$strategy, DateTimeImmutable $startTimestampCandle): ?CryptoSignal
    {
        $signals = $strategy->getSignals(CriteriaSystem::createOrderByCriteria('timestamp', Criteria::DESC));

        if (!$signals->isEmpty() and ($expiredSignal = $this->getRelatedSignal($signals)) !== null)
        {
            $startTimestampSignal = $expiredSignal->getTimestamp();

            // check if the interval between the start timestamp of the signal and the candle is greater than validity period of signal
            if ($this->checkRelationExistenceByStartTimestampValues($startTimestampSignal, $startTimestampCandle))
            {
                // change signal state to 'close'
                $expiredSignal->setState(CryptoSignal::STATE_CLOSE);
                $this->updateSignalData($expiredSignal);

                return $expiredSignal;
            }
            return null;
        }
        return null;
    }

    /**
     * @param Collection|CryptoSignal[] $signals
     *
     * @return CryptoSignal
     */
    public function getRelatedSignal(Collection $signals): ?CryptoSignal
    {
        $signalsWaitingForApprove = new ArrayCollection();

        foreach ($signals as $index => $signal) {
            if ($signal->getState() == CryptoSignal::STATE_OPEN)
            {
                $signalsWaitingForApprove[] = $signal;
            }
            else
            {
                break;
            }
        }

        if ($signalsWaitingForApprove->count() == 0)
        {
            return null;
        } else {
            return $signalsWaitingForApprove->last();
        }
    }

    /**
     * @param DateTimeImmutable $startTimestampSignal
     * @param DateTimeImmutable $startTimestampCandle
     *
     * @return bool
     */
    public function checkRelationExistenceByStartTimestampValues(DateTimeImmutable $startTimestampSignal,
                                                                 DateTimeImmutable $startTimestampCandle): bool
    {
        if ($startTimestampCandle > $startTimestampSignal)
        {
            $seconds = $startTimestampCandle->format('U') - $startTimestampSignal->format('U');
            $minutes = $seconds / 60;

            return $minutes > CryptoSignal::VALIDITY_PERIOD_MINS;
        }
        return false;
    }

    /**
     * @param User $user
     *
     * @return array
     */
    public function getUserPurchasedSignals(User &$user)
    {
        $purchasedSignals = array();

        $transactionHistory = $user->getWallet()->getTransactionHistory(CriteriaSystem::createOrderByCriteria(
            'createdAt', Criteria::DESC));
        $transactionHistoryPaymentType = $this->transactionService->getTransactionsOfCertainTypes($transactionHistory,
            array(Transaction::TYPE_PAYMENT));

        if (!$transactionHistory->isEmpty())
        {
            $purchasedSignals = $this->transactionService->obtainSignalsFromTransactionHistory($transactionHistoryPaymentType);
        }
        return $purchasedSignals;
    }

    /**
     * @param CryptoSignal $signal
     * @throws \Doctrine\Orm|ORMException
     *
     */
    public function updateSignalData(CryptoSignal &$signal)
    {
        $this->signalRepository->update($signal);
    }

    /**
     * @param string|int $action
     *
     * @return string|int
     */
    public function getActionType($action)
    {
        if (is_string($action))
        {
            if ($action === 'FLAT')
            {
               return CryptoSignal::ACTION_FLAT;
            }
            elseif ($action === 'SELL')
            {
                return CryptoSignal::ACTION_SELL;
            }
            elseif ($action === 'BUY')
            {
                return CryptoSignal::ACTION_BUY;
            }
        }
        elseif (is_int($action))
        {
            if ($action === CryptoSignal::ACTION_FLAT)
            {
                return 'FLAT';
            }
            elseif ($action === CryptoSignal::ACTION_SELL)
            {
                return 'SELL';
            }
            elseif ($action === CryptoSignal::ACTION_BUY)
            {
                return 'BUY';
            }
        }
    }

    /**
     * @param string|int $trade
     *
     * @return string|int
     */
    public function getTradeType($trade)
    {
        if (is_string($trade))
        {
            if ($trade === 'SHORT')
            {
                return CryptoSignal::TYPE_SHORT;
            }
            elseif ($trade === 'LONG')
            {
                return CryptoSignal::TYPE_LONG;
            }
        }
        elseif (is_int($trade))
        {
            if ($trade === CryptoSignal::TYPE_SHORT)
            {
                return 'SHORT';
            }
            elseif ($trade === CryptoSignal::TYPE_LONG)
            {
                return 'LONG';
            }
        }
    }

    /**
     * @param CryptoSignal $purchasedSignal
     *
     * @return array
     */
    public function prepareRelatedInfoToPurchasedSignal(CryptoSignal &$purchasedSignal)
    {
        $action = $this->getActionType($purchasedSignal->getAction());
        $type = $this->getTradeType($purchasedSignal->getType());

        $relatedStrategy = $purchasedSignal->getRelatedStrategy();
        $market = $relatedStrategy->getMarket();

        $purchasedSignalInfo = [
            'timestamp' => $purchasedSignal->getTimestamp(DATE_ATOM),
            "market" => $market->getStrRepresentation(),
            'action' => $action . ' ' . $type,
            'strategyId' => $relatedStrategy->getId(),
            'strategyName' => $relatedStrategy->getName()
        ];
        return $purchasedSignalInfo;
    }

    /**
     * @param Collection|Candle[] $strategyCandles
     * @param Collection|CryptoSignal[] $signals
     *
     * @return array
     */
    public function mapSignalsToCandleSticksGraph(Collection $strategyCandles, Collection $signals)
    {
        $strategySignals = $signals->toArray();

        $indexOfCurrentSignal = 0;
        $indexOfLastSignal = count($strategySignals) - 1;

        // anonymous function for getting next valid 'close' signal for mapping to candlesticks data
        $getNextSignal = function($strategySignals) use (&$indexOfCurrentSignal, &$indexOfLastSignal)
        {
            $nextSignal = null;
            if ($indexOfCurrentSignal <= $indexOfLastSignal
                and $strategySignals[$indexOfCurrentSignal]->getState() === CryptoSignal::STATE_CLOSE)
            {
                $nextSignal = $strategySignals[$indexOfCurrentSignal];
            }
            $indexOfCurrentSignal++;
            return $nextSignal;
        };

        /** @var CryptoSignal|null $currentSignal */
        $currentSignal = $getNextSignal($strategySignals);

        $graphData = array();

        foreach ($strategyCandles as $candle)
        {
            $candleInfo = [
                'timestamp' => $candle->getTimestamp(DATE_ATOM),
                'open'   => $candle->getOpen(),
                'high'   => $candle->getHigh(),
                'low'    => $candle->getLow(),
                'close'  => $candle->getClose(),
                'volume' => $candle->getVolume()
            ];
            // mapping signal data to related candles for trade graph
            if ($currentSignal and $currentSignal->getTimestamp() <= $candle->getTimestamp())
            {
                $action = $this->getActionType($currentSignal->getAction());
                $type = $this->getTradeType($currentSignal->getType());

                $candleInfo['signal_prediction'] = $action . ' ' . $type;
                $candleInfo['signal_ask_price'] = $currentSignal->getAsk();

                $currentSignal = $getNextSignal($strategySignals);
            }
            $graphData[] = $candleInfo;
        }
        return $graphData;
    }


}