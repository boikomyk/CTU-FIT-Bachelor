<?php

namespace App\Repository;

use App\Entity\Candle;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Candle|null find($id, $lockMode = null, $lockVersion = null)
 * @method Candle|null findOneBy(array $criteria, array $orderBy = null)
 * @method Candle[]    findAll()
 * @method Candle[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CandleRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Candle::class);
    }

    /**
     * @param Candle $candle
     *
     * @throws \Doctrine\Orm\ORMException in case of failed transaction to database*
     */
    public function add(Candle $candle)
    {
        $entityManager = $this->getEntityManager();

        $entityManager->persist($candle);
        $entityManager->flush($candle);

        $entityManager->refresh($candle);
    }
    // /**
    //  * @return Candle[] Returns an array of Candle objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Candle
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
