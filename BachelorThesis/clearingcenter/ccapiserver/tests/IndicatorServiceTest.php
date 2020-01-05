<?php
declare(strict_types=1);

namespace App\Tests;

use App\Service\IndicatorService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;


final class IndicatorServiceTest extends TestCase
{
    public function testCanBeFoundValidIndicator(): void
    {
        $indicatorId = 1;
        /** @var IndicatorService | MockObject $indicatorService */
        $indicatorService = $this->createMock(IndicatorService::class);
        try{
            $indicatorService->findIndicators(array($indicatorId));
            $this->addToAssertionCount(1);

        } catch (\Exception $e)
        {
            $this->fail("Cannot be found valid indicator");
            return;
        }
    }

}
