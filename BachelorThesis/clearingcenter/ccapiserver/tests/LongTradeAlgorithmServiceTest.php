<?php
declare(strict_types=1);

namespace App\Tests;

use App\Entity\LongTradeAlgorithm;
use App\Service\LongTradeAlgorithmService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;


final class LongTradeAlgorithmServiceTest extends TestCase
{
    public function testCanBeCreatedStrategyStatistics(): void
    {
        /** @var LongTradeAlgorithmService | MockObject $longTradeAlgorithmService */
        $longTradeAlgorithmService = $this->createMock(LongTradeAlgorithmService::class);
        try{
            $longTradeAlgorithm = $longTradeAlgorithmService->createLongTradeAlgorithmSimulation();

            $this->assertInstanceOf(LongTradeAlgorithm::class, $longTradeAlgorithm);
        } catch (\Exception $e)
        {
            $this->fail("Failed to create long trade algorithm object");
        }
    }
}