<?php
declare(strict_types=1);

namespace App\Tests;


use App\Entity\CryptoSignal;
use App\Entity\Order;
use App\Service\OrderService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;


final class OrderServiceTest extends TestCase
{
    public function testCanBeCreatedOrder(): void
    {
        /** @var OrderService | MockObject $orderService */
        $orderService = $this->createMock(OrderService::class);
        try{
            $validCryptoSignal = new CryptoSignal();
            $order = $orderService->prepareNewOrder($validCryptoSignal);
            $this->assertInstanceOf(Order::class, $order);
        } catch (\Exception $e)
        {
            $this->fail("Fail to creat to new Order object");
        }

    }

}