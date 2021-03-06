<?php

namespace App\Repository;

use App\Entity\Transaction;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Transaction|null find($id, $lockMode = null, $lockVersion = null)
 * @method Transaction|null findOneBy(array $criteria, array $orderBy = null)
 * @method Transaction[]    findAll()
 * @method Transaction[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TransactionRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Transaction::class);
    }

    /**
     * @param Transaction $transaction
     *
     * @throws \Doctrine\Orm\ORMException in case of failed transaction to database
     */
    public function add(Transaction $transaction)
    {
        $entityManager = $this->getEntityManager();

        $entityManager->persist($transaction);
        $entityManager->flush($transaction);
        $entityManager->refresh($transaction);
    }

}
