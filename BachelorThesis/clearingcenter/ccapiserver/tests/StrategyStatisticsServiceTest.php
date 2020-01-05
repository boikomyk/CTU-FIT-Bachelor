<?php
declare(strict_types=1);

namespace App\Tests;

use App\Entity\StrategyStatistics;
use App\Service\StrategyStatisticsService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;


final class StrategyStatisticsServiceTest extends TestCase
{
    public function testCanBeCreatedStrategyStatistics(): void
    {
        /** @var StrategyStatisticsService | MockObject $strategyStatisticsService */
        $strategyStatisticsService = $this->createMock(StrategyStatisticsService::class);
        try{
            $strategyStatistics = $strategyStatisticsService->createStrategyStatisticsPortfolio();

            $this->assertInstanceOf(StrategyStatistics::class, $strategyStatistics);

        } catch (\Exception $e)
        {
            $this->fail("Failed to create strategy statistics data object");
        }
    }
}