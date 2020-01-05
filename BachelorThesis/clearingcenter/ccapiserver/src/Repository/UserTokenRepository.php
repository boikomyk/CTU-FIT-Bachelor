<?php

namespace App\Repository;

use App\Entity\UserToken;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method UserToken|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserToken|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserToken[]    findAll()
 * @method UserToken[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserTokenRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, UserToken::class);
    }


    public function add(UserToken $userToken): void
    {
        $entityManager = $this->getEntityManager();

        $entityManager->persist($userToken);
        $entityManager->flush($userToken);
    }

    public function remove(UserToken $token)
    {
        $entityManager = $this->getEntityManager();

        $entityManager->remove($token);
        $entityManager->flush($token);
    }
}
