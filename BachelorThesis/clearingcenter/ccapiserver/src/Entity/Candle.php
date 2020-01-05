<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CandleRepository")
 */
class Candle
{
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
    private $open;

    /**
     * @ORM\Column(type="float")
     */
    private $high;

    /**
     * @ORM\Column(type="float")
     */
    private $low;

    /**
     * @ORM\Column(type="float")
     */
    private $close;

    /**
     * Volume in base currency
     * @ORM\Column(type="float")
     */
    private $volume;

    /**
     * Volume in quote currency
     * @ORM\Column(type="float")
     */
    private $volumeQuote;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Strategy", inversedBy="candles")
     * @ORM\JoinColumn(nullable=false)
     */
    private $relatedStrategy;

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

    public function getOpen(): ?float
    {
        return $this->open;
    }

    public function setOpen(float $open): self
    {
        $this->open = $open;

        return $this;
    }

    public function getHigh(): ?float
    {
        return $this->high;
    }

    public function setHigh(float $high): self
    {
        $this->high = $high;

        return $this;
    }

    public function getLow(): ?float
    {
        return $this->low;
    }

    public function setLow(float $low): self
    {
        $this->low = $low;

        return $this;
    }

    public function getClose(): ?float
    {
        return $this->close;
    }

    public function setClose(float $close): self
    {
        $this->close = $close;

        return $this;
    }

    public function getVolume(): ?float
    {
        return $this->volume;
    }

    public function setVolume(float $volume): self
    {
        $this->volume = $volume;

        return $this;
    }

    public function getVolumeQuote(): ?float
    {
        return $this->volumeQuote;
    }

    public function setVolumeQuote(float $volumeQuote): self
    {
        $this->volumeQuote = $volumeQuote;

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
}
