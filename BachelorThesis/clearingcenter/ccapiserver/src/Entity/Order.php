<?php

namespace App\Entity;

use Doctrine\Common\Collections\{
    ArrayCollection,
    Collection,
    Criteria
};
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="`order`")
 * @ORM\Entity(repositoryClass="App\Repository\OrderRepository")
 */
class Order
{
    const STATE_UNPROVED = 1;
    const STATE_APPROVED = 2;

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\CryptoSignal", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $attachedSignal;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Transaction", mappedBy="order")
     */
    private $involvedTransactions;

    /**
     * @ORM\Column(type="smallint")
     */
    private $state;

    public function __construct()
    {
        $this->state = self::STATE_UNPROVED;
        $this->involvedTransactions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAttachedSignal(): ?CryptoSignal
    {
        return $this->attachedSignal;
    }

    public function setAttachedSignal(CryptoSignal $attachedSignal): self
    {
        $this->attachedSignal = $attachedSignal;

        return $this;
    }

    /**
     * @return Collection|Transaction[]
     */
    public function getInvolvedTransactions(): Collection
    {
        return $this->involvedTransactions;
    }

    public function addInvolvedTransaction(Transaction $involvedTransaction): self
    {
        if (!$this->involvedTransactions->contains($involvedTransaction)) {
            $this->involvedTransactions[] = $involvedTransaction;
            $involvedTransaction->setOrder($this);
        }

        return $this;
    }

    public function removeInvolvedTransaction(Transaction $involvedTransaction): self
    {
        if ($this->involvedTransactions->contains($involvedTransaction)) {
            $this->involvedTransactions->removeElement($involvedTransaction);
            // set the owning side to null (unless already changed)
            if ($involvedTransaction->getOrder() === $this) {
                $involvedTransaction->setOrder(null);
            }
        }

        return $this;
    }

    public function getState(): ?int
    {
        return $this->state;
    }

    public function setState(int $state): self
    {
        $this->state = $state;

        return $this;
    }
}
