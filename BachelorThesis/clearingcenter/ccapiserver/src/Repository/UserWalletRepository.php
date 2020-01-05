<?php

namespace App\Repository;

use App\Entity\UserWallet;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method UserWallet|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserWallet|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserWallet[]    findAll()
 * @method UserWallet[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserWalletRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, UserWallet::class);
    }

    /**
     * @param UserWallet $wallet
     *
     * @throws \Doctrine\Orm\ORMException in case of failed transaction to database
     */
    public function add(UserWallet $wallet)
    {
        $entityManager = $this->getEntityManager();

        $entityManager->persist($wallet);
        $entityManager->flush($wallet);
        $entityManager->refresh($wallet);
    }

    /**
     * @param UserWallet $wallet
     *
     * @throws \Doctrine\Orm\ORMException in case of failed transaction to database
     */
    public function update(UserWallet $wallet)
    {
        $entityManager = $this->getEntityManager();

        $entityManager->flush($wallet);
        $entityManager->refresh($wallet);
    }

    // /**
    //  * @return UserWallet[] Returns an array of UserWallet objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?UserWallet
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
