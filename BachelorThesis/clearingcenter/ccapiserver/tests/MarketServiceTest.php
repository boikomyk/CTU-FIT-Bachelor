<?php
declare(strict_types=1);

namespace App\Tests;

use App\Service\IndicatorService;
use App\Service\MarketService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;


final class MarketServiceTest extends TestCase
{
    public function testCanBeFoundValidMarket(): void
    {
        $marketId = 1;

        /** @var MarketService | MockObject $marketService */
        $marketService = $this->createMock(MarketService::class);
        try{
            $marketService->findMarket((string)$marketId);
            $this->addToAssertionCount(1);
        } catch (\Exception $e)
        {
            $this->fail("Cannot be found valid market");
        }

    }

}