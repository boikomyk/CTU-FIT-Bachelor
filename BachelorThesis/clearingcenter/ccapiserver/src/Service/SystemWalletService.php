<?php

namespace App\Service;

use App\Entity\SystemWallet;
use App\Exception\BadParameterException;
use App\Repository\SystemWalletRepository;

class SystemWalletService
{

    /**
     * @var SystemWalletRepository
     */
    private $systemWalletRepository;

    public function __construct(
        SystemWalletRepository $systemWalletRepository
    )
    {
        $this->systemWalletRepository = $systemWalletRepository;
    }

    /**
     * @param int $systemWalletType
     *
     * @throws BadParameterException, \Doctrine\ORM\ORMException
     *
     * @return SystemWallet
     */
    public function getSystemWalletByType(int $systemWalletType): SystemWallet
    {
        if ($systemWalletType !== SystemWallet::TYPE_FREEZE and $systemWalletType !== SystemWallet::TYPE_INCOME)
        {
            throw new BadParameterException('Such type of wallet isn\'t supported yet');
        }
        return $this->systemWalletRepository->findOneBy(array('type' => $systemWalletType));
    }

    /**
     * @param SystemWallet $systemWallet
     * @param float $funds
     *
     * @throws \Doctrine\ORM\ORMException
     */
    public function addFundsToSystemWallet(SystemWallet &$systemWallet, float $funds)
    {
        $systemWallet->increaseTotalBalance($funds);
        $this->updateSystemWallet($systemWallet);
    }

    /**
     * @param SystemWallet $systemWallet
     * @param float $funds
     *
     * @throws \Doctrine\ORM\ORMException
     */
    public function subtractFundsFromSystemWallet(SystemWallet &$systemWallet, float $funds)
    {
        $systemWallet->decreaseTotalBalance($funds);
        $this->updateSystemWallet($systemWallet);
    }

    /**
     * @param SystemWallet $sysWalletFrozen
     * @param SystemWallet $sysWalletIncome
     * @param float $frozenFunds
     * @param float $income
     *
     * @throws \Doctrine\ORM\ORMException
     */
    public function takeServiceProfit(SystemWallet &$sysWalletFrozen, SystemWallet &$sysWalletIncome, float $frozenFunds, float $income)
    {
        $this->subtractFundsFromSystemWallet($sysWalletFrozen, $frozenFunds);
        $this->addFundsToSystemWallet($sysWalletIncome, $income);
    }


    /**
     * @param float $paidFunds
     *
     * @return float $serviceIncome
     */
    public function calculateServiceProfit(float $paidFunds)
    {
        return (float) ($paidFunds/100) * SystemWallet::PROFIT_PERCENTAGE;
    }

    /**
     * @param SystemWallet $systemWallet
     *
     * @throws \Doctrine\ORM\ORMException
     */
    public function updateSystemWallet(SystemWallet &$systemWallet)
    {
        $this->systemWalletRepository->update($systemWallet);
    }
}