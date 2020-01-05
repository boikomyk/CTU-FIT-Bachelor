<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 2019-04-24
 * Time: 01:20
 */

namespace App\Service;


use App\Entity\{
    StrategyStatistics,
    CryptoSignal
};
use App\Repository\StrategyStatisticsRepository;

class StrategyStatisticsService
{
    /**
     * @var LongTradeAlgorithmService
     */
    private $longTradeAlgorithmService;
    /**
     * @var StrategyStatisticsRepository
     */
    private $strategyStatisticsRepository;

    public function __construct(
        LongTradeAlgorithmService $longTradeAlgorithmService,
        StrategyStatisticsRepository $strategyStatisticsRepository
    )
    {
        $this->longTradeAlgorithmService = $longTradeAlgorithmService;
        $this->strategyStatisticsRepository = $strategyStatisticsRepository;
    }

    /**
     * @return StrategyStatistics
     *
     * @throws \Doctrine\Orm\ORMException
     */
    public function createStrategyStatisticsPortfolio(): StrategyStatistics
    {
        $longTradeAlgorithm = $this->longTradeAlgorithmService->createLongTradeAlgorithmSimulation();

        $statistics = new StrategyStatistics();
        $statistics->setLongTradeAlgorithm($longTradeAlgorithm);

        $this->strategyStatisticsRepository->add($statistics);
        return $statistics;
    }

    /**
     * @param StrategyStatistics $statisticsToActualize
     * @param int $action
     * @param float $askPrice
     *
     * @throws \Doctrine\Orm\ORMException
     */
    public function actualizeStatisticsInfo(StrategyStatistics &$statisticsToActualize, int $action, float $askPrice)
    {
        $longTradeAlgorithmSimulation = $statisticsToActualize->getLongTradeAlgorithm();
        $isBuyTradeOpened = $this->longTradeAlgorithmService->isBuyTradeOpened($longTradeAlgorithmSimulation);

        // simulate 'SELL' trade, close long trade and calculate profit
        if ($isBuyTradeOpened and $action == CryptoSignal::ACTION_SELL)
        {
            $purchasedAmount = $this->longTradeAlgorithmService->simulateSellTrade($longTradeAlgorithmSimulation, $askPrice);
            $statisticsToActualize->increaseStrategyBalance($purchasedAmount);

            $profitOfLastTrade = $this->longTradeAlgorithmService->getProfitOfLastTrade($longTradeAlgorithmSimulation);
            $totalProfitInPercent = $this->longTradeAlgorithmService->getTotalProfitInPercent($longTradeAlgorithmSimulation);
            $cntOfAllTrades = $statisticsToActualize->getNumberOfTrades();

            $this->longTradeAlgorithmService->resetLastTradeRecord($longTradeAlgorithmSimulation);

            // Long - buy lower, sell higher (total_sell - total_buy = profit)

            if ($profitOfLastTrade > 0.0)
            {
                $cntOfProfitTrades = $statisticsToActualize->getProfitTrades();
                $statisticsToActualize->setProfitTrades($cntOfProfitTrades + 1);
            } else {
                $cntOfLossTrades   = $statisticsToActualize->getLossTrades();
                $statisticsToActualize->setLossTrades($cntOfLossTrades + 1);
            }
            $statisticsToActualize->setNumberOfTrades($cntOfAllTrades + 1);
            $statisticsToActualize->setTotalPerformance($totalProfitInPercent);

            $this->strategyStatisticsRepository->update($statisticsToActualize);
        }
        // simulate first or one more 'BUY' trade
        elseif ($action == CryptoSignal::ACTION_BUY)
        {
            $spendingAmount = $this->longTradeAlgorithmService->simulateBuyTrade($longTradeAlgorithmSimulation, $askPrice);
            $statisticsToActualize->decreaseStrategyBalance($spendingAmount);

            $this->strategyStatisticsRepository->update($statisticsToActualize);
        }
    }

    /**
     * @param StrategyStatistics $strategyStatistics
     * @param string $baseCurrencySymbol
     *
     * @return array
     */
    public function getStrategyStatisticsPortfolio(StrategyStatistics &$strategyStatistics, string $baseCurrencySymbol): array
    {
        $numberOfTrades = $strategyStatistics->getNumberOfTrades();
        $profitTrades   = $strategyStatistics->getProfitTrades();
        $lossTrades     = $strategyStatistics->getLossTrades();

        $percentOfProfitTrades = ' (' . 0 . '%)';
        $percentOfLossTrades   = ' (' . 0 . '%)';
        if ($numberOfTrades != 0)
        {
            $percentOfProfitTrades = ' (' . (($profitTrades/$numberOfTrades) * 100) . '%)';
            $percentOfLossTrades   = ' (' . (($lossTrades/$numberOfTrades) * 100) . '%)';
        }

        $statistics = [
            'initialCapital' =>  StrategyStatistics::INITIAL_CAPITAL . ' ' . $baseCurrencySymbol,
            'strategyBalance' => $strategyStatistics->getStrategyBalance() . ' ' . $baseCurrencySymbol,
            'totalPerformance' => round($strategyStatistics->getTotalPerformance(),2 ),
            'numberOfTrades' => $strategyStatistics->getNumberOfTrades(),
            'profitTrades' => $strategyStatistics->getProfitTrades() . $percentOfProfitTrades,
            'lossTrades' => $strategyStatistics->getLossTrades() . $percentOfLossTrades,
        ];

        return $statistics;
    }
}