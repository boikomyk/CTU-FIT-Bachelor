<?php

namespace App\Repository;

use App\Entity\StrategyStatistics;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method StrategyStatistics|null find($id, $lockMode = null, $lockVersion = null)
 * @method StrategyStatistics|null findOneBy(array $criteria, array $orderBy = null)
 * @method StrategyStatistics[]    findAll()
 * @method StrategyStatistics[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class StrategyStatisticsRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, StrategyStatistics::class);
    }

    /**
     * @param StrategyStatistics $strategyStatistics
     *
     * @throws \Doctrine\Orm\ORMException in case of failed transaction to database*
     */
    public function add(StrategyStatistics $strategyStatistics)
    {
        $entityManager = $this->getEntityManager();

        $entityManager->persist($strategyStatistics);
        $entityManager->flush($strategyStatistics);
        $entityManager->refresh($strategyStatistics);
    }

    /**
     * @param StrategyStatistics $strategyStatistics
     *
     * @throws \Doctrine\Orm\ORMException in case of failed transaction to database*
     */
    public function update(StrategyStatistics $strategyStatistics)
    {
        $entityManager = $this->getEntityManager();

        $entityManager->flush($strategyStatistics);
        $entityManager->refresh($strategyStatistics);
    }


    // /**
    //  * @return StrategyStatistics[] Returns an array of StrategyStatistics objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?StrategyStatistics
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
