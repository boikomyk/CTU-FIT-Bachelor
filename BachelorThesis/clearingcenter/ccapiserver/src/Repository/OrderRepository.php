<?php

namespace App\Repository;

use App\Entity\Order;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Order|null find($id, $lockMode = null, $lockVersion = null)
 * @method Order|null findOneBy(array $criteria, array $orderBy = null)
 * @method Order[]    findAll()
 * @method Order[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OrderRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Order::class);
    }

    /**
     * @param Order $order
     *
     * @throws \Doctrine\Orm\ORMException in case of failed transaction to database*
     */
    public function add(Order $order)
    {
        $entityManager = $this->getEntityManager();

        $entityManager->persist($order);
        $entityManager->flush($order);
        $entityManager->refresh($order);
    }

    public function update(Order $order)
    {
        $entityManager = $this->getEntityManager();

        $entityManager->flush($order);
        $entityManager->refresh($order);
    }
}
