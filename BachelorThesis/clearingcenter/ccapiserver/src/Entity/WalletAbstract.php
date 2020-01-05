<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * WalletAbstract
 *
 * @ORM\MappedSuperclass()
 */
abstract class WalletAbstract
{
    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     *
     * @var int
     */
    protected $id;

    /**
     * @ORM\Column(type="float")
     *
     * @var float
     */
    protected $totalBalance = 0;

    /**
     * @return  int
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTotalBalance(): float
    {
        return $this->totalBalance;
    }

    public function increaseTotalBalance(float $amount): self
    {
        $this->totalBalance += $amount;
        return $this;
    }

    public function decreaseTotalBalance(float $amount): self
    {
        $this->totalBalance -= $amount;
        return $this;
    }

}