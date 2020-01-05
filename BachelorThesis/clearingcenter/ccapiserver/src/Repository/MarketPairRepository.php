<?php

namespace App\Repository;

use App\Entity\MarketPair;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method MarketPair|null find($id, $lockMode = null, $lockVersion = null)
 * @method MarketPair|null findOneBy(array $criteria, array $orderBy = null)
 * @method MarketPair[]    findAll()
 * @method MarketPair[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MarketPairRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, MarketPair::class);
    }

    // /**
    //  * @return MarketPair[] Returns an array of MarketPair objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('m.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?MarketPair
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
