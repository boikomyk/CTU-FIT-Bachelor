<?php
namespace App\Listener\Entity;

use DateTime;
use Doctrine\ORM\Event\LifecycleEventArgs;
use App\Entity\UserWallet;

class UserWalletListener
{
    /**
     * @param UserWallet $userWallet
     * @param LifecycleEventArgs $args
     * @throws \Exception
     */
    public function preUpdate(UserWallet $userWallet, LifecycleEventArgs $args)
    {
        $userWallet->setUpdatedAt(new DateTime());
    }
}