<?php
declare(strict_types=1);

namespace App\Tests;

use App\Entity\LongTradeAlgorithm;
use App\Entity\StrategyStatistics;
use App\Entity\SystemWallet;
use App\Entity\User;
use App\Service\StrategyService;
use App\Service\StrategyStatisticsService;
use App\Service\SystemWalletService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;


final class SystemWalletServiceTest extends TestCase
{
    public function testCanBeObtainedFreezeTypeSystemWallet(): void
    {
        /** @var SystemWalletService | MockObject $systemWalletService */
        $systemWalletService = $this->createMock(SystemWalletService::class);
        try{
            $systemWalletFreeze = $systemWalletService->getSystemWalletByType(SystemWallet::TYPE_FREEZE);

            $this->assertInstanceOf(SystemWallet::class, $systemWalletFreeze);

        } catch (\Exception $e)
        {
            $this->fail("Failed to obtain freeze type system wallet");
        }
    }

    public function testCanBeObtainedIncomeTypeSystemWallet(): void
    {
        /** @var SystemWalletService | MockObject $systemWalletService */
        $systemWalletService = $this->createMock(SystemWalletService::class);
        try{
            $systemWalletIncome = $systemWalletService->getSystemWalletByType(SystemWallet::TYPE_INCOME);

            $this->assertInstanceOf(SystemWallet::class, $systemWalletIncome);

        } catch (\Exception $e)
        {
            $this->fail("Failed to obtain income type system wallet");
        }
    }
}