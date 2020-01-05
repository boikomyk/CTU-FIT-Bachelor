<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 2019-04-24
 * Time: 01:20
 */

namespace App\Service;


use App\Entity\LongTradeAlgorithm;
use App\Repository\LongTradeAlgorithmRepository;

class LongTradeAlgorithmService
{
    /**
     * @var LongTradeAlgorithmRepository
     */
    private $longTradeAlgorithmRepository;

    public function __construct(LongTradeAlgorithmRepository $longTradeAlgorithmRepository)
    {
        $this->longTradeAlgorithmRepository = $longTradeAlgorithmRepository;
    }


    /**
     * @return LongTradeAlgorithm
     *
     * @throws \Doctrine\ORM\ORMException
     */
    public function createLongTradeAlgorithmSimulation(): LongTradeAlgorithm
    {
        $longTradeAlgorithm = new LongTradeAlgorithm();

        $this->longTradeAlgorithmRepository->add($longTradeAlgorithm);
        return $longTradeAlgorithm;
    }

    /**
     * @param LongTradeAlgorithm $longTradeAlgorithmSimulation
     *
     * @return bool
     */
    public function isBuyTradeOpened(LongTradeAlgorithm &$longTradeAlgorithmSimulation): bool
    {
        return ($longTradeAlgorithmSimulation->getQuatedAmount() > 0.0 and $longTradeAlgorithmSimulation->getBaseSpending() > 0.0);
    }

    /**
     * @param LongTradeAlgorithm $longTradeAlgorithmSimulation
     * @param float askPrice
     *
     * @return float
     *
     * @throws \Doctrine\ORM\ORMException
     */
    public function simulateBuyTrade(LongTradeAlgorithm &$longTradeAlgorithmSimulation, float $askPrice): float
    {
        $spendingAmount = $askPrice * LongTradeAlgorithm::QUATED_AMOUNT;

        $longTradeAlgorithmSimulation->increaseQuatedAmount(LongTradeAlgorithm::QUATED_AMOUNT)
            ->increaseBaseSpending($spendingAmount)->increaseTotalBaseSpending($spendingAmount);

        $this->longTradeAlgorithmRepository->update($longTradeAlgorithmSimulation);

        return $spendingAmount;
    }

    /**
     * @param LongTradeAlgorithm $longTradeAlgorithmSimulation
     * @param float askPrice
     *
     * @return float
     *
     * @throws \Doctrine\ORM\ORMException
     */
    public function simulateSellTrade(LongTradeAlgorithm &$longTradeAlgorithmSimulation, float $askPrice): float
    {
        $cntOfQuatedToSell = $longTradeAlgorithmSimulation->getQuatedAmount();

        $purchasedBase = $askPrice * $cntOfQuatedToSell;
        $longTradeAlgorithmSimulation->increaseBasePurchased($purchasedBase)->increaseTotalBasePurchased($purchasedBase);

        $this->longTradeAlgorithmRepository->update($longTradeAlgorithmSimulation);

        return $purchasedBase;
    }

    /**
     * @param LongTradeAlgorithm $longTradeAlgorithmSimulation
     *
     * @return float
     */
    public function getProfitOfLastTrade(LongTradeAlgorithm &$longTradeAlgorithmSimulation): float
    {
        $basePurchased = $longTradeAlgorithmSimulation->getBasePurchased();
        $baseSpending  = $longTradeAlgorithmSimulation->getBaseSpending();
        $profit = $basePurchased - $baseSpending;

        return $profit;
    }

    /**
     * @param LongTradeAlgorithm $longTradeAlgorithmSimulation
     *
     * @throws \Doctrine\ORM\ORMException
     */
    public function resetLastTradeRecord(LongTradeAlgorithm &$longTradeAlgorithmSimulation)
    {
        $longTradeAlgorithmSimulation->setQuatedAmount(0.0);
        $longTradeAlgorithmSimulation->setBasePurchased(0.0);
        $longTradeAlgorithmSimulation->setBaseSpending(0.0);

        $this->longTradeAlgorithmRepository->update($longTradeAlgorithmSimulation);
    }


    /**
     * @param LongTradeAlgorithm $longTradeAlgorithmSimulation
     *
     * @return float
     */
    public function getTotalProfitInPercent(LongTradeAlgorithm &$longTradeAlgorithmSimulation): float
    {
        // Long - buy lower, sell higher;
        // percentage gain = ((price_sold - purchase_price)/purchase_price)x100

        // Sell trades
        $totalPurchased = $longTradeAlgorithmSimulation->getTotalBasePurchased();
        // Buy trades
        $totalSpending  = $longTradeAlgorithmSimulation->getTotalBaseSpending();

        $profit = $totalPurchased - $totalSpending;
        $profitInPercent = 0;
        if ($totalSpending >  0.00000000)
        {
            $profitInPercent = $profit/$totalSpending * 100;
        }

        return $profitInPercent;
    }
}