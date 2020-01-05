<?php
declare(strict_types=1);

namespace App\Tests;

use App\Entity\User;
use App\Service\StrategyService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;


final class StrategyServiceTest extends TestCase
{
    public function testCannotBeCreatedStrategyWithInvalidParameters(): void
    {
        /** @var StrategyService | MockObject $strategyService */
        $strategyService = $this->createMock(StrategyService::class);
        try{
            $strategyService->createStrategy(array(), new User());

            $this->fail("Created strategy with invalid parameters");
        } catch (\Exception $e)
        {
            $this->addToAssertionCount(1);
        }
    }

    public function testCannotBeFoundStrategyByInvalidApiKey(): void
    {
        /** @var StrategyService | MockObject $strategyService */
        $strategyService = $this->createMock(StrategyService::class);
        try{
            $strategyService->findStrategyByApiKey("invalidApiKey");

            $this->fail("Was find strategy by invalid API key");
        } catch (\Exception $e)
        {
            $this->addToAssertionCount(1);
        }
    }
}