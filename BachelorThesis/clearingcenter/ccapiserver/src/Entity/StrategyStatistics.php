<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\StrategyStatisticsRepository")
 */
class StrategyStatistics
{
    const INITIAL_CAPITAL = 10000.0;
    const AMOUNT = 1;

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     */
    private $strategyBalance;

    /**
     * @ORM\Column(type="float")
     */
    private $totalPerformance;

    /**
     * @ORM\Column(type="integer")
     */
    private $numberOfTrades;

    /**
     * @ORM\Column(type="integer")
     */
    private $profitTrades;

    /**
     * @ORM\Column(type="integer")
     */
    private $lossTrades;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\LongTradeAlgorithm", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $longTradeAlgorithm;

    public function __construct()
    {
        $this->strategyBalance = self::INITIAL_CAPITAL;
        $this->totalPerformance = 0;
        $this->numberOfTrades = 0;
        $this->profitTrades = 0;
        $this->lossTrades = 0;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStrategyBalance(): ?float
    {
        return $this->strategyBalance;
    }

    public function setStrategyBalance(float $strategyBalance): self
    {
        $this->strategyBalance = $strategyBalance;

        return $this;
    }

    public function increaseStrategyBalance(float $amount): self
    {
        $this->strategyBalance += $amount;

        return $this;
    }

    public function decreaseStrategyBalance(float $amount): self
    {
        $this->strategyBalance -= $amount;

        return $this;
    }

    public function getTotalPerformance(): ?float
    {
        return $this->totalPerformance;
    }

    public function setTotalPerformance(float $totalPerformance): self
    {
        $this->totalPerformance = $totalPerformance;

        return $this;
    }

    public function getNumberOfTrades(): ?int
    {
        return $this->numberOfTrades;
    }

    public function setNumberOfTrades(int $numberOfTrades): self
    {
        $this->numberOfTrades = $numberOfTrades;

        return $this;
    }

    public function getProfitTrades(): ?int
    {
        return $this->profitTrades;
    }

    public function setProfitTrades(int $profitTrades): self
    {
        $this->profitTrades = $profitTrades;

        return $this;
    }

    public function getLossTrades(): ?int
    {
        return $this->lossTrades;
    }

    public function setLossTrades(int $lossTrades): self
    {
        $this->lossTrades = $lossTrades;

        return $this;
    }

    public function getLongTradeAlgorithm(): ?LongTradeAlgorithm
    {
        return $this->longTradeAlgorithm;
    }

    public function setLongTradeAlgorithm(LongTradeAlgorithm $longTradeAlgorithm): self
    {
        $this->longTradeAlgorithm = $longTradeAlgorithm;

        return $this;
    }
}
