<?php

namespace App\Entity;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TransactionRepository")
 */
class Transaction
{
    const TYPE_PAYMENT  = 1;
    const TYPE_INCOME   = 2;
    const TYPE_REFUND   = 3;
    const TYPE_ABORT    = 4;

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\UserWallet")
     * @ORM\JoinColumn(nullable=false)
     */
    private $senderAddr;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\UserWallet")
     * @ORM\JoinColumn(nullable=false)
     */
    private $receiverAddr;

    /**
     * @ORM\Column(type="smallint")
     */
    private $type;

    /**
     * @ORM\Column(type="float")
     */
    private $amount;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Order", inversedBy="involvedTransactions")
     * @ORM\JoinColumn(name="order_id", referencedColumnName="id", nullable=false)
     */
    private $order;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\UserWallet", inversedBy="transactionHistory")
     * @ORM\JoinColumn(nullable=false)
     */
    private $historyRecord;

    /**
     * @ORM\Column(type="datetime_immutable")
     */
    private $createdAt;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSenderAddr(): ?UserWallet
    {
        return $this->senderAddr;
    }

    public function setSenderAddr(UserWallet $senderAddr): self
    {
        $this->senderAddr = $senderAddr;

        return $this;
    }

    public function getReceiverAddr(): ?UserWallet
    {
        return $this->receiverAddr;
    }

    public function setReceiverAddr(UserWallet $receiverAddr): self
    {
        $this->receiverAddr = $receiverAddr;

        return $this;
    }
    
    public function getType(): ?int
    {
        return $this->type;
    }

    public function setType(int $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getOrder(): ?Order
    {
        return $this->order;
    }

    public function setOrder(?Order $order): self
    {
        $this->order = $order;

        return $this;
    }

    public function getHistoryRecord(): ?UserWallet
    {
        return $this->historyRecord;
    }

    public function setHistoryRecord(?UserWallet $historyRecord): self
    {
        $this->historyRecord = $historyRecord;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}
