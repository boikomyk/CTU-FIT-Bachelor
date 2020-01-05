<?php

namespace App\Repository;

use App\Entity\FollowingInfo;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method FollowingInfo|null find($id, $lockMode = null, $lockVersion = null)
 * @method FollowingInfo|null findOneBy(array $criteria, array $orderBy = null)
 * @method FollowingInfo[]    findAll()
 * @method FollowingInfo[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FollowingInfoRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, FollowingInfo::class);
    }

    /**
     * @param FollowingInfo $followingInfo
     *
     * @throws \Doctrine\Orm\ORMException in case of failed transaction to database*
     */
    public function add(FollowingInfo $followingInfo)
    {
        $entityManager = $this->getEntityManager();

        $entityManager->persist($followingInfo);
        $entityManager->flush($followingInfo);
        $entityManager->refresh($followingInfo);
    }

    /**
     * @param FollowingInfo $followingInfo
     *
     * @throws \Doctrine\Orm\ORMException in case of failed transaction to database*
     */
    public function update(FollowingInfo $followingInfo)
    {
        $entityManager = $this->getEntityManager();

        $entityManager->flush($followingInfo);
        $entityManager->refresh($followingInfo);
    }

    /**
     * @param FollowingInfo $followingInfo
     *
     * @throws \Doctrine\Orm\ORMException in case of failed transaction to database*
     */
    public function remove(FollowingInfo $followingInfo)
    {
        $entityManager = $this->getEntityManager();

        $entityManager->remove($followingInfo);
        $entityManager->flush($followingInfo);
    }
}
