<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\MarketRepository")
 */
class Market
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Exchange")
     * @ORM\JoinColumn(nullable=false)
     */
    private $exchange;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\MarketPair")
     * @ORM\JoinColumn(nullable=false)
     */
    private $marketPair;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getExchange(): ?Exchange
    {
        return $this->exchange;
    }

    public function setExchange(?Exchange $exchange): self
    {
        $this->exchange = $exchange;

        return $this;
    }

    public function getMarketPair(): ?MarketPair
    {
        return $this->marketPair;
    }

    public function setMarketPair(?MarketPair $marketPair): self
    {
        $this->marketPair = $marketPair;

        return $this;
    }

    public function getStrRepresentation(): string
    {
        return $this->getExchange()->getName() . ': '
            . $this->getMarketPair()->getCoin() . '/'
            . $this->getMarketPair()->getCurrency();
    }
}
