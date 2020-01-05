<?php

namespace App\Service;

use App\Entity\{
    Strategy,
    User,
    FollowingInfo
};
use App\Repository\FollowingInfoRepository;
use Doctrine\Common\Collections\Collection;


class FollowingInfoService
{
    /**
     * @var FollowingInfoRepository
     */
    private $followingInfoRepository;

    public function __construct(
        FollowingInfoRepository $followingInfoRepository
    )
    {
        $this->followingInfoRepository = $followingInfoRepository;

    }

    /**
     * @param User $user
     * @param Strategy $strategy
     * @param bool $subscription
     *
     * @return bool
     * @throws \Doctrine\Orm\ORMException
     */
    public function createOrUpdateSubscription(User &$user, Strategy &$strategy, bool $subscription): bool
    {
        // check if user is already follow related strategy
        $followingInfoToUpdate = $this->getUserFollowInfoByStrategy($user->getFollowingStrategiesInfo(), $strategy);

        // if user follow strategy, update subscription
        if ($followingInfoToUpdate)
        {
            // change only in case of actual subscription is different from request contained one
            if ($followingInfoToUpdate->getSubscription() != $subscription)
            {
                $this->updateSubscription($followingInfoToUpdate, $subscription);
                return true;
            }
        }
        else{
            # in case of missing existing following info, create new with related turnOn or turnOff subscription
            $this->addFollowingInfo($user, $strategy, $subscription);
            return true;
        }
        return false;
    }

    /**
     * @param FollowingInfo $followingInfoToUpdate
     * @param bool $subscription
     *
     * @throws \Doctrine\Orm\ORMException
     */
    public function updateSubscription(FollowingInfo &$followingInfoToUpdate, bool $subscription)
    {
        $followingInfoToUpdate->setSubscription($subscription);
        $this->followingInfoRepository->update($followingInfoToUpdate);
    }

    /**
     * @param User $user
     * @param Strategy $strategy
     * @param bool subscription
     *
     * @throws \Doctrine\Orm\ORMException
     */
    public function addFollowingInfo(User &$user, Strategy &$strategy, bool $subscription)
    {
        $followingInfo = new FollowingInfo();
        $followingInfo->setUser($user);
        $followingInfo->setStrategy($strategy);
        $followingInfo->setSubscription($subscription);

        $user->addFollowingStrategyInfo($followingInfo);
        $strategy->addFollowedByInfo($followingInfo);

        $this->followingInfoRepository->add($followingInfo);
    }

    /**
     * @param User $user
     * @param Strategy $strategy
     *
     * @throws \Doctrine\Orm\ORMException
     */
    public function removeFollowingInfo(User &$user, Strategy &$strategy)
    {
        $followersInfo = $strategy->getFollowedByInfo();
        $followingInfoToRemove = null;
        foreach($followersInfo->getIterator() as $index => $followerInfo)
        {
            /* @var FollowingInfo $followerInfo*/
            if ($followerInfo->getUser() === $user)
            {
                $followingInfoToRemove = $followerInfo;
                break;
            }
        }
        $user->removeFollowingStrategyInfo($followingInfoToRemove);
        $strategy->removeFollowedByInfo($followingInfoToRemove);

        $this->followingInfoRepository->remove($followingInfoToRemove);
    }

    /**
     * @param Collection|FollowingInfo[] $followerInfo
     *
     * @return Collection
     */
    public function getSubscribersInfo(Collection $followerInfo): Collection
    {
        $predicate = function($followedByInfo){
            return true === $followedByInfo->getSubscription();
        };

        $subscribersInfo = $followerInfo->filter($predicate);
        return $subscribersInfo;
    }

    /**
     * @param Collection|FollowingInfo[] $userFollowingsInfo
     * @param Strategy $strategy
     *
     * @return FollowingInfo|null
     */
    public function getUserFollowInfoByStrategy(Collection $userFollowingsInfo, Strategy &$strategy): ?FollowingInfo
    {
        foreach ($userFollowingsInfo as $index => $followingInfo)
        {
            if($followingInfo->getStrategy() === $strategy)
            {
                return $followingInfo;
            }
        }
        return null;
    }


}