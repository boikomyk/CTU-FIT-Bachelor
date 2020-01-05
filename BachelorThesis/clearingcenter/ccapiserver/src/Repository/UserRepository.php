<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * @param User $user
     *
     * @throws \Doctrine\Orm\ORMException in case of failed transaction to database
     *
     * @return User
     */
    public function add(User $user): User
    {
        $entityManager = $this->getEntityManager();

        $entityManager->persist($user);
        $entityManager->flush($user);
        $entityManager->refresh($user);

        return $user;
    }

    public function update(User $user)
    {
        $entityManager = $this->getEntityManager();

        $entityManager->flush($user);
        $entityManager->refresh($user);
    }

}
