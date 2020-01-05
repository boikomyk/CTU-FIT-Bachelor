<?php

namespace App\Service;

use App\Entity\Indicator;
use App\Repository\IndicatorRepository;
use App\Exception\BadParameterException;
use Doctrine\Common\Collections\Collection;


class IndicatorService
{
    /**
     * @var IndicatorRepository
     */
    private $indicatorRepository;

    public function __construct(IndicatorRepository $indicatorRepository)
    {
        $this->indicatorRepository = $indicatorRepository;
    }

    /**
     * @param array $indicatorsId
     *
     * @throws BadParameterException if not filled all required fields
     *
     * @return array
     */
    public function findIndicators(array $indicatorsId): array
    {
        $indicators = $this->indicatorRepository->findBy(array('id' => $indicatorsId));
        if (count($indicators) == 0)
        {
            throw new BadParameterException("Such indicators isn't supported yet");
        }
        return $indicators;
    }

    /**
     * @param Collection $indicators
     *
     * @return array
     */
    public function getIndicatorsAbr(Collection $indicators): array
    {
        $indicatorsAbr = [];
        foreach ($indicators as $indicator) {
            $indicatorsAbr[] = [
                "id" => $indicator->getId(),
                "name" => $indicator->getAbbreviation()
            ];
        }
        return $indicatorsAbr;
    }
}