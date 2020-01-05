<?php

namespace App\Repository;

use App\Entity\LongTradeAlgorithm;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method LongTradeAlgorithm|null find($id, $lockMode = null, $lockVersion = null)
 * @method LongTradeAlgorithm|null findOneBy(array $criteria, array $orderBy = null)
 * @method LongTradeAlgorithm[]    findAll()
 * @method LongTradeAlgorithm[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class LongTradeAlgorithmRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, LongTradeAlgorithm::class);
    }

    /**
     * @param LongTradeAlgorithm $longTradeAlgorithm
     *
     * @throws \Doctrine\Orm\ORMException in case of failed transaction to database*
     */
    public function add(LongTradeAlgorithm $longTradeAlgorithm)
    {
        $entityManager = $this->getEntityManager();

        $entityManager->persist($longTradeAlgorithm);
        $entityManager->flush($longTradeAlgorithm);
        $entityManager->refresh($longTradeAlgorithm);
    }


    /**
     * @param LongTradeAlgorithm $longTradeAlgorithm
     *
     * @throws \Doctrine\Orm\ORMException in case of failed transaction to database*
     */
    public function update(LongTradeAlgorithm $longTradeAlgorithm)
    {
        $entityManager = $this->getEntityManager();

        $entityManager->flush($longTradeAlgorithm);
        $entityManager->refresh($longTradeAlgorithm);
    }


    // /**
    //  * @return LongTradeAlgorithm[] Returns an array of LongTradeAlgorithm objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('l')
            ->andWhere('l.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('l.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?LongTradeAlgorithm
    {
        return $this->createQueryBuilder('l')
            ->andWhere('l.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
