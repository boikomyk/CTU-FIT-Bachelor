<?php

namespace App\Service;


use App\Entity\UserWallet;
use App\Repository\UserWalletRepository;

class UserWalletService
{
    /**
     * @var UserWalletRepository
     */
    private $userWalletRepository;

    public function __construct(
        UserWalletRepository $userWalletRepository
    )
    {
        $this->userWalletRepository = $userWalletRepository;
    }

    /**
     * @param UserWallet $userWallet
     * @param float $amount
     *
     * @throws \Doctrine\ORM\ORMException
     *
     * @return string
     */
    public function increaseBalance(UserWallet &$userWallet, float $amount): string
    {
        $balance = $userWallet->increaseTotalBalance($amount)->getTotalBalance();
        $this->updateUserWallet($userWallet);

        return (string)$balance;
    }

    /**
     * @param UserWallet $userWallet
     * @param float $amount
     *
     * @throws \Doctrine\ORM\ORMException
     */
    public function freezeUpBalanceFundsToAmount(UserWallet &$userWallet, float $amount)
    {
        $userWallet->increaseFrozenBalance($amount)->decreaseTotalBalance($amount);

        $this->updateUserWallet($userWallet);
    }

    /**
     * @param UserWallet $userWallet
     * @param float $amount
     * @param bool $refund
     *
     * @throws \Doctrine\ORM\ORMException
     */
    public function unfreezeFrozenFunds(UserWallet &$userWallet, float $amount, bool $refund)
    {
        $userWallet->decreaseFrozenBalance($amount);
        if ($refund)
        {
            $userWallet->increaseTotalBalance($amount);
        }

        $this->updateUserWallet($userWallet);
    }

    /**
     * @param UserWallet $userWallet
     *
     * @throws \Doctrine\ORM\ORMException
     */
    public function updateUserWallet(UserWallet &$userWallet)
    {
        $this->userWalletRepository->update($userWallet);
    }

    /**
     * @param UserWallet $userWallet
     * @param float $makerFee
     *
     * @return bool
     */
    public function checkFundsAvailability(UserWallet &$userWallet, float $makerFee): bool
    {
        return $userWallet->getTotalBalance() >= $makerFee;
    }
}