<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\MarketPairRepository")
 */
class MarketPair
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $currency;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $coin;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCurrency(): ?string
    {
        return $this->currency;
    }

    public function setCurrency(string $currency): self
    {
        $this->currency = $currency;

        return $this;
    }

    public function getCoin(): ?string
    {
        return $this->coin;
    }

    public function setCoin(string $coin): self
    {
        $this->coin = $coin;

        return $this;
    }
}
