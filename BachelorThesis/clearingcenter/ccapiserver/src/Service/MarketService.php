<?php

namespace App\Service;

use App\Entity\Market;
use App\Repository\MarketRepository;
use App\Exception\BadParameterException;


class MarketService
{
    /**
     * @var MarketRepository
     */
    private $marketRepository;

    public function __construct(MarketRepository $marketRepository)
    {
        $this->marketRepository = $marketRepository;
    }

    /**
     * @param string $marketId
     *
     * @throws BadParameterException if not filled all required fields
     *
     * @return Market
     */
    public function findMarket(string $marketId): Market
    {
        if (($market = $this->marketRepository->find($marketId)) === null)
        {
            throw new BadParameterException("Such market isn't supported yet");
        }
        return $market;
    }

    /**
     * @param Market $strategyMarket
     * @param string $exchange
     * @param string $currency
     * @param string $coin
     *
     * @return bool
     */
    public function checkIdentityOfMarketExchange(Market &$strategyMarket,
                                                  string $exchange, string $currency, string $coin): bool
    {
        return ($strategyMarket->getExchange()->getName() == $exchange
            and $strategyMarket->getMarketPair()->getCurrency() == $currency
            and $strategyMarket->getMarketPair()->getCoin() == $coin);
    }


}