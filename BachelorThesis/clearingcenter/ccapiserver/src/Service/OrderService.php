<?php

namespace App\Service;


use App\Entity\{CryptoSignal, Order, Transaction};
use App\Repository\OrderRepository;


class OrderService
{
    /**
     * @var OrderRepository
     */
    private $orderRepository;

    public function __construct(OrderRepository $orderRepository)
    {
        $this->orderRepository = $orderRepository;
    }

    /**
     * @param CryptoSignal $signal
     *
     * @throws \Doctrine\ORM\ORMException
     * @return Order
     */
    public function prepareNewOrder(CryptoSignal &$signal): Order
    {
        $order = new Order();
        $order->setAttachedSignal($signal);

        // persist new order to database
        $this->orderRepository->add($order);
        return $order;
    }

    /**
     * @param CryptoSignal $signal
     *
     * @return null|Order
     */
    public function findExistingOrder(CryptoSignal &$signal): ?Order
    {
        $requiredOrder = $this->orderRepository->findOneBy(array('attachedSignal' => $signal));
        return $requiredOrder;
    }

    /**
     * @param Order $order
     */
    public function changeOrderStateToApproved(Order &$order)
    {
        $order->setState(Order::STATE_APPROVED);
        $this->orderRepository->update($order);
    }
}