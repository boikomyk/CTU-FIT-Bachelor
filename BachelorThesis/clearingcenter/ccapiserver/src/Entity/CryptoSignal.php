<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

use DateTimeImmutable;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CryptoSignalRepository")
 */
class CryptoSignal
{
    const VALIDITY_PERIOD_MINS = 30.0;

    const STATE_OPEN    = 0;
    const STATE_CLOSE   = 1;

    const TYPE_SHORT    = -1;
    const TYPE_LONG     = 1;

    const ACTION_FLAT   = 0;
    const ACTION_SELL   = -1;
    const ACTION_BUY    = 1;

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="datetime_immutable")
     */
    private $timestamp;

    /**
     * @ORM\Column(type="float")
     */
    private $buyStart;

    /**
     * @ORM\Column(type="float")
     */
    private $buyEnd;

    /**
     * @ORM\Column(type="integer")
     */
    private $type;

    /**
     * @ORM\Column(type="integer")
     */
    private $action;

    /**
     * @ORM\Column(type="float")
     */
    private $ask;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Strategy", inversedBy="signals")
     * @ORM\JoinColumn(nullable=false)
     */
    private $relatedStrategy;

    /**
     * @ORM\Column(type="smallint")
     */
    private $state;

    public function __construct()
    {
        $this->state = self::STATE_OPEN;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @param string $strFormat
     *
     * @return \DateTimeImmutable|string
     */
    public function getTimestamp(string $strFormat = null)
    {
        if ($strFormat !== null) {
            return (clone $this->timestamp)->format($strFormat);
        }
        return $this->timestamp;
    }

    public function setTimestamp(\DateTimeImmutable $timestamp): self
    {
        $this->timestamp = $timestamp;

        return $this;
    }

    public function getBuyStart(): float
    {
        return $this->buyStart;
    }

    public function setBuyStart(float $buyStart): self
    {
        $this->buyStart = $buyStart;

        return $this;
    }

    public function getBuyEnd(): float
    {
        return $this->buyEnd;
    }

    public function setBuyEnd(float $buyEnd): self
    {
        $this->buyEnd = $buyEnd;

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

    public function getAction(): ?int
    {
        return $this->action;
    }

    public function setAction(int $action): self
    {
        $this->action = $action;

        return $this;
    }

    public function getAsk(): ?float
    {
        return $this->ask;
    }

    public function setAsk(float $ask): self
    {
        $this->ask = $ask;

        return $this;
    }

    public function getRelatedStrategy(): ?Strategy
    {
        return $this->relatedStrategy;
    }

    public function setRelatedStrategy(?Strategy $relatedStrategy): self
    {
        $this->relatedStrategy = $relatedStrategy;

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
