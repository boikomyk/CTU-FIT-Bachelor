<?php

namespace App\Service;


use App\Entity\{
    Candle,
    CryptoSignal,
    Strategy
};
use App\Exception\InvalidCandleException;
use App\Repository\CandleRepository;
use App\Service\CryptoSignalService;
use App\Utils\CriteriaSystem;
use Doctrine\Common\Collections\Criteria;


class CandleService
{
    /**
     * @var CandleRepository
     */
    private $candleRepository;
    /**
     * @var CryptoSignalService
     */
    private $signalService;

    public function __construct(
        CandleRepository $candleRepository,
        CryptoSignalService $signalService
    )
    {
        $this->candleRepository = $candleRepository;
        $this->signalService = $signalService;
    }

    /**
     * @param Strategy $strategy
     * @param array $candleData
     *
     * @return Candle
     * @throws \Doctrine\Orm\ORMException
     */
    public function proceedReceivedCandle(Strategy &$strategy, array $candleData): Candle
    {
        // create candle entity object and fill it's class fields with input params
        $candle = new Candle();
        $candle->setTimestamp(new \DateTimeImmutable($candleData['timestamp']));
        $candle->setOpen((float)$candleData['open']);
        $candle->setHigh((float)$candleData['high']);
        $candle->setLow((float)$candleData['low']);
        $candle->setClose((float)$candleData['close']);
        $candle->setVolume((float)$candleData['volume']);
        $candle->setVolumeQuote((float)$candleData['volumeQuote']);
        $candle->setRelatedStrategy($strategy);

        // add new candle record to internal database
        $this->candleRepository->add($candle);

        return $candle;
    }
}