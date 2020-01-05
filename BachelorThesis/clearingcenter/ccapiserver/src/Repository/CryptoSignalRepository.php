<?php

namespace App\Repository;

use App\Entity\CryptoSignal;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method CryptoSignal|null find($id, $lockMode = null, $lockVersion = null)
 * @method CryptoSignal|null findOneBy(array $criteria, array $orderBy = null)
 * @method CryptoSignal[]    findAll()
 * @method CryptoSignal[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CryptoSignalRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, CryptoSignal::class);
    }

    /**
     * @param CryptoSignal $signal
     *
     * @throws \Doctrine\Orm\ORMException in case of failed transaction to database*
     */
    public function add(CryptoSignal $signal)
    {
        $entityManager = $this->getEntityManager();

        $entityManager->persist($signal);
        $entityManager->flush($signal);
        $entityManager->refresh($signal);
    }

    /**
     * @param CryptoSignal $signal
     *
     * @throws \Doctrine\Orm\ORMException in case of failed transaction to database*
     */
    public function update(CryptoSignal $signal)
    {
        $entityManager = $this->getEntityManager();

        $entityManager->flush($signal);
        $entityManager->refresh($signal);
    }

    // /**
    //  * @return Signal[] Returns an array of Signal objects
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
    public function findOneBySomeField($value): ?Signal
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
