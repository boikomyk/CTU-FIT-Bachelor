<?php

namespace App\Repository;

use App\Entity\SystemWallet;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method SystemWallet|null find($id, $lockMode = null, $lockVersion = null)
 * @method SystemWallet|null findOneBy(array $criteria, array $orderBy = null)
 * @method SystemWallet[]    findAll()
 * @method SystemWallet[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SystemWalletRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, SystemWallet::class);
    }

    /**
     * @param SystemWallet $wallet
     *
     * @throws \Doctrine\Orm\ORMException in case of failed transaction to database
     */
    public function add(SystemWallet $wallet)
    {
        $entityManager = $this->getEntityManager();

        $entityManager->persist($wallet);
        $entityManager->flush($wallet);
        $entityManager->refresh($wallet);
    }

    /**
     * @param SystemWallet $wallet
     *
     * @throws \Doctrine\Orm\ORMException in case of failed transaction to database
     */
    public function update(SystemWallet $wallet)
    {
        $entityManager = $this->getEntityManager();

        $entityManager->flush($wallet);
        $entityManager->refresh($wallet);
    }
}
