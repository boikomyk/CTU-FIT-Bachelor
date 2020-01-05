<?php

namespace App\Entity;

use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;

/**
 * @ORM\Entity(repositoryClass="App\Repository\StrategyRepository")
 */
class Strategy
{
    /**
     * @ORM\Column(type="uuid", unique=true)
     * @ORM\Id()
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class="Ramsey\Uuid\Doctrine\UuidGenerator")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50, unique=true)
     */
    private $name;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $type = 'Single-Market Strategy (SMS)';

    /**
     * @ORM\Column(type="text")
     */
    private $about;

    /**
     * @ORM\Column(type="float")
     */
    private $makerFee;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Market")
     */
    private $market;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Indicator")
     */
    private $indicators;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     */
    private $apiKey;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="myStrategies")
     * @ORM\JoinColumn(nullable=false)
     */
    private $creator;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\FollowingInfo", mappedBy="strategy", orphanRemoval=true)
     */
    private $followedByInfo;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\CryptoSignal", mappedBy="relatedStrategy")
     */
    private $signals;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Candle", mappedBy="relatedStrategy", orphanRemoval=true)
     */
    private $candles;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\StrategyStatistics", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $statistics;


    public function __construct(string $name)
    {
        $this->name = $name;
        $this->createdAt = new DateTimeImmutable();
        $this->indicators = new ArrayCollection();
        $this->followedByInfo = new ArrayCollection();
        $this->signals = new ArrayCollection();
        $this->candles = new ArrayCollection();
    }

    public function getId(): string
    {
        return (string)$this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getCreatedAt(string $strFormat = null)
    {
        if ($strFormat !== null)
        {
            return (clone $this->createdAt)->format($strFormat);
        }
        return $this->createdAt;
    }

    public function getType(): ?string
    {
        return $this->type;
    }


    public function getAbout(): ?string
    {
        return $this->about;
    }

    public function setAbout(string $about): self
    {
        $this->about = $about;

        return $this;
    }

    public function getMakerFee(): ?float
    {
        return $this->makerFee;
    }

    public function setMakerFee(float $makerFee): self
    {
        $this->makerFee = $makerFee;

        return $this;
    }

    public function getMarket(): ?Market
    {
        return $this->market;
    }

    public function setMarket(?Market $market): self
    {
        $this->market = $market;

        return $this;
    }

    /**
     * @return Collection|Indicator[]
     */
    public function getIndicators(): Collection
    {
        return $this->indicators;
    }

    public function addIndicator(Indicator $indicator): self
    {
        if (!$this->indicators->contains($indicator)) {
            $this->indicators[] = $indicator;
        }

        return $this;
    }

    public function removeIndicator(Indicator $indicator): self
    {
        if ($this->indicators->contains($indicator)) {
            $this->indicators->removeElement($indicator);
        }

        return $this;
    }

    public function removeAllIndicators()
    {
        $this->getIndicators()->clear();
    }

    public function getApiKey(): ?string
    {
        return $this->apiKey;
    }

    public function setApiKey(string $apiKey): self
    {
        $this->apiKey = $apiKey;

        return $this;
    }

    public function getCreator(): ?User
    {
        return $this->creator;
    }

    public function setCreator(?User $creator): self
    {
        $this->creator = $creator;

        return $this;
    }

    /**
     * @param Criteria|null $criteria
     *
     * @return Collection|CryptoSignal[]
     */
    public function getSignals(Criteria $criteria = null): Collection
    {
        if($criteria)
        {
            return $this->signals->matching($criteria);
        }
        return $this->signals;
    }

    public function addSignal(CryptoSignal $signal): self
    {
        if (!$this->signals->contains($signal)) {
            $this->signals[] = $signal;
            $signal->setRelatedStrategy($this);
        }

        return $this;
    }

    public function removeSignal(CryptoSignal $signal): self
    {
        if ($this->signals->contains($signal)) {
            $this->signals->removeElement($signal);
            // set the owning side to null (unless already changed)
            if ($signal->getRelatedStrategy() === $this) {
                $signal->setRelatedStrategy(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|FollowingInfo[]
     */
    public function getFollowedByInfo(): Collection
    {
        return $this->followedByInfo;
    }


    public function addFollowedByInfo(FollowingInfo $followingInfo): self
    {
        if (!$this->followedByInfo->contains($followingInfo)) {
            $this->followedByInfo[] = $followingInfo;
        }

        return $this;
    }


    public function removeFollowedByInfo(FollowingInfo $followRelation): self
    {
        if ($this->followedByInfo->contains($followRelation)) {
            $this->followedByInfo->removeElement($followRelation);
        }

        return $this;
    }

    /**
     * @param Criteria|null $criteria
     *
     * @return Collection|Candle[]
     */
    public function getCandles(Criteria $criteria = null): Collection
    {
        if($criteria)
        {
            return $this->candles->matching($criteria);
        }
        return $this->candles;
    }

    public function addCandle(Candle $candle): self
    {
        if (!$this->candles->contains($candle)) {
            $this->candles[] = $candle;
            $candle->setRelatedStrategy($this);
        }

        return $this;
    }

    public function removeCandle(Candle $candle): self
    {
        if ($this->candles->contains($candle)) {
            $this->candles->removeElement($candle);
            // set the owning side to null (unless already changed)
            if ($candle->getRelatedStrategy() === $this) {
                $candle->setRelatedStrategy(null);
            }
        }

        return $this;
    }

    public function getStatistics(): ?StrategyStatistics
    {
        return $this->statistics;
    }

    public function setStatistics(StrategyStatistics $statistics): self
    {
        $this->statistics = $statistics;

        return $this;
    }
}
