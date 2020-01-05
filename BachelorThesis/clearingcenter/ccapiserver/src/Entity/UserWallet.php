<?php

namespace App\Entity;

use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\WalletAbstract;
use Gedmo\Timestampable\Traits\TimestampableEntity;
use mysql_xdevapi\CrudOperationBindable;


/**
 * @ORM\EntityListeners({"App\Listener\Entity\UserWalletListener"})
 * @ORM\Entity(repositoryClass="App\Repository\UserWalletRepository")
 */
class UserWallet extends WalletAbstract
{
    use TimestampableEntity;

    /**
     * @ORM\Column(type="float")
     *
     * @var float
     */
    private $frozenBalance = 0;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\User", mappedBy="wallet", cascade={"persist", "remove"})
     */
    private $owner;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Transaction", mappedBy="historyRecord")
     */
    private $transactionHistory;


    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->updatedAt = new \DateTime();
        $this->transactionHistory = new ArrayCollection();
    }

    public function getFrozenBalance(): float
    {
        return $this->frozenBalance;
    }

    public function increaseFrozenBalance(float $amount): self
    {
        $this->frozenBalance += $amount;
        return $this;
    }

    public function decreaseFrozenBalance(float $amount): self
    {
        $this->frozenBalance -= $amount;
        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(User $owner): self
    {
        $this->owner = $owner;

        // set the owning side of the relation if necessary
        if ($this !== $owner->getWallet()) {
            $owner->setWallet($this);
        }

        return $this;
    }

    /**
     * @param Criteria|null $criteria
     *
     * @return Collection|Transaction[]
     */
    public function getTransactionHistory(Criteria $criteria = null): Collection
    {
        if($criteria)
        {
            return $this->transactionHistory->matching($criteria);
        }
        return $this->transactionHistory;
    }

    public function addTransactionHistory(Transaction $transactionHistory): self
    {
        if (!$this->transactionHistory->contains($transactionHistory)) {
            $this->transactionHistory[] = $transactionHistory;
            $transactionHistory->setHistoryRecord($this);
        }

        return $this;
    }

    public function removeTransactionHistory(Transaction $transactionHistory): self
    {
        if ($this->transactionHistory->contains($transactionHistory)) {
            $this->transactionHistory->removeElement($transactionHistory);
            // set the owning side to null (unless already changed)
            if ($transactionHistory->getHistoryRecord() === $this) {
                $transactionHistory->setHistoryRecord(null);
            }
        }

        return $this;
    }
}
