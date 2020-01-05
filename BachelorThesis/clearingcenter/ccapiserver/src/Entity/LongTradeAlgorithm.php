<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\LongTradeAlgorithmRepository")
 */
class LongTradeAlgorithm
{
    // Long - buy lower, sell higher
    const QUATED_AMOUNT = 1;

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     */
    private $quatedAmount;

    /**
     * @ORM\Column(type="float")
     */
    private $baseSpending;

    /**
     * @ORM\Column(type="float")
     */
    private $basePurchased;

    /**
     * @ORM\Column(type="float")
     */
    private $totalBaseSpending;

    /**
     * @ORM\Column(type="float")
     */
    private $totalBasePurchased;

    public function __construct()
    {
        $this->quatedAmount = 0.0;
        $this->baseSpending = 0.0;
        $this->basePurchased = 0.0;
        $this->totalBaseSpending = 0.0;
        $this->totalBasePurchased = 0.0;
    }

    public function getId(): ?int
    {
        return $this->id;
    }


    public function getQuatedAmount(): ?float
    {
        return $this->quatedAmount;
    }

    public function setQuatedAmount(float $quatedAmount): self
    {
        $this->quatedAmount = $quatedAmount;

        return $this;
    }

    public function increaseQuatedAmount(float $amountOfPurchased): self
    {
        $this->quatedAmount += $amountOfPurchased;

        return $this;
    }

    public function getBaseSpending(): ?float
    {
        return $this->baseSpending;
    }

    public function setBaseSpending(float $baseSpending): self
    {
        $this->baseSpending = $baseSpending;

        return $this;
    }

    public function increaseBaseSpending(float $amountOfSpending): self
    {
        $this->baseSpending += $amountOfSpending;

        return $this;
    }

    public function getBasePurchased(): ?float
    {
        return $this->basePurchased;
    }

    public function setBasePurchased(float $basePurchased): self
    {
        $this->basePurchased = $basePurchased;

        return $this;
    }

    public function increaseBasePurchased(float $amountOfPurchased): self
    {
        $this->basePurchased += $amountOfPurchased;

        return $this;
    }

    public function getTotalBaseSpending(): ?float
    {
        return $this->totalBaseSpending;
    }

    public function setTotalBaseSpending(float $totalBaseSpending): self
    {
        $this->totalBaseSpending = $totalBaseSpending;

        return $this;
    }

    public function increaseTotalBaseSpending(float $amountOfSpending): self
    {
        $this->totalBaseSpending += $amountOfSpending;

        return $this;
    }

    public function getTotalBasePurchased(): ?float
    {
        return $this->totalBasePurchased;
    }

    public function setTotalBasePurchased(float $totalBasePurchased): self
    {
        $this->totalBasePurchased = $totalBasePurchased;

        return $this;
    }

    public function increaseTotalBasePurchased(float $amountOfPurchased): self
    {
        $this->totalBasePurchased += $amountOfPurchased;

        return $this;
    }
}
