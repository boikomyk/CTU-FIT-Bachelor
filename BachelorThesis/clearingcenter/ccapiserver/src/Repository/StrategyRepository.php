<?php

namespace App\Repository;

use App\Entity\Strategy;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Strategy|null find($id, $lockMode = null, $lockVersion = null)
 * @method Strategy|null findOneBy(array $criteria, array $orderBy = null)
 * @method Strategy[]    findAll()
 * @method Strategy[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class StrategyRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Strategy::class);
    }

    /**
     * @param Strategy $strategy
     *
     * @throws \Doctrine\Orm\ORMException in case of failed transaction to database*
     */
    public function add(Strategy $strategy)
    {
        $entityManager = $this->getEntityManager();

        $entityManager->persist($strategy);
        $entityManager->flush($strategy);
        $entityManager->refresh($strategy);
    }

    /**
     * @param Strategy $strategy
     *
     * @throws \Doctrine\Orm\ORMException in case of failed transaction to database*
     */
    public function update(Strategy $strategy)
    {
        $entityManager = $this->getEntityManager();

        $entityManager->flush($strategy);
        $entityManager->refresh($strategy);
    }
}
