<?php

namespace App\Service;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Exception\BadParameterException;
use App\Service\{
    OrderService,
    FollowingInfoService,
    UserWalletService
};
use App\Entity\{Candle, FollowingInfo, Strategy, SystemWallet, Transaction, CryptoSignal, Order, User, UserWallet};
use App\Repository\TransactionRepository;
use App\Utils\ValidationAuditor;

class TransactionService
{
    /**
     * @var OrderService
     */
    private $orderService;
    /**
     * @var FollowingInfoService
     */
    private $followingInfoService;
    /**
     * @var UserWalletService
     */
    private $userWalletService;
    /**
     * @var SystemWalletService
     */
    private $systemWalletService;
    /**
     * @var TransactionRepository
     */
    private $transactionRepository;

    public function __construct(
        OrderService $orderService,
        FollowingInfoService $followingInfoService,
        UserWalletService $userWalletService,
        SystemWalletService $systemWalletService,
        TransactionRepository $transactionRepository
    )
    {
        $this->orderService = $orderService;
        $this->followingInfoService = $followingInfoService;
        $this->userWalletService = $userWalletService;
        $this->systemWalletService = $systemWalletService;
        $this->transactionRepository = $transactionRepository;
    }

    /**
     * @param CryptoSignal $signal
     * @param Strategy $relatedStrategy
     *
     * @return array
     * @throws \Doctrine\ORM\ORMException
     * @throws BadParameterException
     */
    public function startUnprovedTransactionProcess(CryptoSignal &$signal, Strategy &$relatedStrategy): array
    {
        // initializing of variable for storing users identify attributes (emails) followed by direct them notifying
        // adding of new identificator is providing only in case of successful 'payment' type transaction
        $userToNotify = array();

        $strategySubscribersInfo = $this->followingInfoService->getSubscribersInfo($relatedStrategy->getFollowedByInfo());

        // if strategy has at least one subscriber, prepare new transaction order and send to each subscriber with this order
        if (!$strategySubscribersInfo->isEmpty())
        {
            // initializing of variable responsible for storing sum of all transferred funds from users wallets
            $systemWalletFrozenFunds = $this->systemWalletService->getSystemWalletByType(SystemWallet::TYPE_FREEZE);

            // get common required params for all being created transactions below
            // - wallet belongs to receiver,
            // - order that contains newly received signal,
            // - cost of related order
            $receiverWalletAddr = $relatedStrategy->getCreator()->getWallet();
            $order = $this->orderService->prepareNewOrder($signal);
            $strategyFee = $relatedStrategy->getMakerFee();

            // for each subscriber initialize transaction of type 'payment'
            foreach ($strategySubscribersInfo as $index => $subscriberInfo)
            {
                /** @var  FollowingInfo $subscriberInfo */
                $userPurchaser = $subscriberInfo->getUser();
                $senderWalletAddr = $userPurchaser->getWallet();

                // check corresponding wallet for requested funds
                if ($this->userWalletService->checkFundsAvailability($senderWalletAddr, $strategyFee))
                {
                    // create 'payment' type transaction and freeze balance funds up to strategy fee
                    $this->createTransaction(Transaction::TYPE_PAYMENT,
                        $strategyFee, $senderWalletAddr, $receiverWalletAddr, $order);

                    $this->freezeAndTransferFundsToSystemWallet($senderWalletAddr, $systemWalletFrozenFunds, $strategyFee);

                    // adding user's identify attribute that successfully paid for proceeding order
                    $userToNotify[] = $userPurchaser->getEmail();

                }
                else {
                    // create 'abort' transaction and turn off subscription
                    $this->createTransaction(Transaction::TYPE_ABORT,
                        $strategyFee, $senderWalletAddr, $receiverWalletAddr, $order);

                    $this->followingInfoService->updateSubscription($subscriberInfo, false);
                }
            }

        }

        return $userToNotify;
    }

    /**
     * @param CryptoSignal $signal
     *
     * @throws \Doctrine\ORM\ORMException,
     * @throws BadParameterException
     */
    public function startApprovedTransactionProcess(CryptoSignal &$signal)
    {
        $orderRelatedToSignal = $this->orderService->findExistingOrder($signal);

        $paymentTransactions = $this->getTransactionsOfCertainTypes($orderRelatedToSignal->getInvolvedTransactions(),
            array(Transaction::TYPE_PAYMENT));

        // validate prediction with related candle info and change order state to approved
        $auditorDecision = ValidationAuditor::validatePrediction($signal);
        $this->orderService->changeOrderStateToApproved($orderRelatedToSignal);

        // STATISTICS SCOPE !!!!

        if(!$paymentTransactions->isEmpty())
        {
            // initializing of variable responsible for storing frozen funds from 'payment' type transactions
            $sysWalletFrozen = $this->systemWalletService->getSystemWalletByType(SystemWallet::TYPE_FREEZE);

            // if prediction was correct, transfer frozen funds to developer wallet
            if($auditorDecision == ValidationAuditor::CORRECT_PREDICTION)
            {
                // initializing of variable responsible for storing service income funds
                $sysWalletIncome = $this->systemWalletService->getSystemWalletByType(SystemWallet::TYPE_INCOME);

                foreach ($paymentTransactions as $index => $paymentTransaction)
                {
                    $paidFunds = $paymentTransaction->getAmount();
                    $serviceProfit = $this->systemWalletService->calculateServiceProfit($paidFunds);
                    $developerIncome = $paidFunds - $serviceProfit;

                    $payerWallet = $paymentTransaction->getSenderAddr();
                    $developerWallet = $paymentTransaction->getReceiverAddr();

                    $this->createTransaction(Transaction::TYPE_INCOME, $developerIncome,
                        $payerWallet, $developerWallet,
                        $orderRelatedToSignal);

                    $this->unfreezeAndTransferFundsToDeveloper($payerWallet, $developerWallet,
                        $sysWalletFrozen, $sysWalletIncome,
                        $paidFunds, $developerIncome, $serviceProfit);
                }
            }
            // in case of bad prediction, return funds to payers wallets
            elseif ($auditorDecision == ValidationAuditor::BAD_PREDICTION)
            {
                foreach ($paymentTransactions as $index => $paymentTransaction)
                {
                    // make refund transactions
                    // unfreeze and return funds to users wallets
                    $paidFunds = $paymentTransaction->getAmount();
                    $payerWallet = $paymentTransaction->getSenderAddr();
                    $developerWallet = $paymentTransaction->getReceiverAddr();

                    $this->createTransaction(Transaction::TYPE_REFUND, $paidFunds,
                        $developerWallet, $payerWallet,
                        $orderRelatedToSignal);

                    $this->unfreezeAndReturnFundsToPayer($payerWallet,
                        $sysWalletFrozen, $paidFunds);
                }
            }
        }
    }

    /**
     * @param int $type
     * @param float $amount
     * @param UserWallet $senderAddr
     * @param UserWallet $receiverAddr
     * @param Order $order
     *
     * @throws \Doctrine\ORM\ORMException
     */
    private function createTransaction(int $type, float $amount, UserWallet &$senderAddr, UserWallet &$receiverAddr, Order &$order)
    {
        $transaction = new Transaction();

        $transaction->setSenderAddr($senderAddr);
        $transaction->setReceiverAddr($receiverAddr);
        $transaction->setOrder($order);
        $transaction->setType($type);
        $transaction->setAmount($amount);

        // only transaction of type 'income' belongs to developer history side
        // other transaction types are recorded to customer(buyer) history side
        // in transactions of type 'refund' user's wallet play receiver's role
        if ($type === Transaction::TYPE_INCOME or $type === Transaction::TYPE_REFUND){
            $transaction->setHistoryRecord($receiverAddr);
        } else {
            $transaction->setHistoryRecord($senderAddr);
        }

        $this->transactionRepository->add($transaction);
    }

    /**
     * @param UserWallet $payerWallet
     * @param SystemWallet $sysWalletFrozen
     * @param float $fundsToFreeze
     *
     * @throws \Doctrine\ORM\ORMException
     */
    public function freezeAndTransferFundsToSystemWallet(UserWallet &$payerWallet, SystemWallet &$sysWalletFrozen, float $fundsToFreeze)
    {
        $this->userWalletService->freezeUpBalanceFundsToAmount($payerWallet, $fundsToFreeze);
        $this->systemWalletService->addFundsToSystemWallet($sysWalletFrozen, $fundsToFreeze);
    }

    /**
     * @param UserWallet $payerWallet
     * @param UserWallet $developerWallet
     * @param SystemWallet $sysWalletFrozen
     * @param SystemWallet $sysWalletIncome
     * @param $frozenFunds
     * @param $developerIncome
     * @param $serviceProfit
     *
     * @throws \Doctrine\ORM\ORMException
     */
    public function unfreezeAndTransferFundsToDeveloper(UserWallet &$payerWallet, UserWallet &$developerWallet,
                                                        SystemWallet &$sysWalletFrozen, SystemWallet &$sysWalletIncome,
                                                        float $frozenFunds, float $developerIncome, float $serviceProfit)
    {
        // unfreeze funds and take service profit
        $this->systemWalletService->takeServiceProfit($sysWalletFrozen, $sysWalletIncome, $frozenFunds, $serviceProfit);
        $this->userWalletService->unfreezeFrozenFunds($payerWallet, $frozenFunds, false);
        // transfer income to developer wallet
        $this->userWalletService->increaseBalance($developerWallet, $developerIncome);
    }

    /**
     * @param UserWallet $payerWallet
     * @param SystemWallet $sysWalletFrozen
     * @param $frozenFunds
     *
     * @throws \Doctrine\ORM\ORMException
     */
    public function unfreezeAndReturnFundsToPayer(UserWallet &$payerWallet, SystemWallet &$sysWalletFrozen, float $frozenFunds)
    {
        $this->systemWalletService->subtractFundsFromSystemWallet($sysWalletFrozen, $frozenFunds);
        $this->userWalletService->unfreezeFrozenFunds($payerWallet, $frozenFunds, true);
    }



    /**
     * @param Collection|Transaction[] $transactions
     * @param array $transactionsTypes
     *
     * @return Collection|Transaction[]
     */
    public function getTransactionsOfCertainTypes(Collection $transactions, array $transactionsTypes): Collection
    {
        /** @var Transaction $transaction */
        $predicate = function($transaction) use ($transactionsTypes){
            return in_array($transaction->getType(), $transactionsTypes);
        };
        $filteredTransactions = $transactions->filter($predicate);

        return $filteredTransactions;
    }

    /**
     * @param Collection|Transaction[] $transactionHistory
     *
     * @return array
     */
    public function prepareTransactionHistory(Collection $transactionHistory)
    {
        $transactions = array();
        foreach ($transactionHistory as $index => $transaction)
        {
            $relatedStrategy = $transaction->getOrder()->getAttachedSignal()->getRelatedStrategy();
            $transactionType = $transaction->getType();

            $transactions[] = [
                'id' => $index + 1,
                'action' => $this->getTransactionTypeStr($transactionType),
                'strategyId' => $relatedStrategy->getId(),
                'strategyName' => $relatedStrategy->getName(),
                'amount' => $transaction->getAmount(),
            ];
        }
        return $transactions;
    }

    /**
     * @param Collection|Transaction[] $transactionHistory
     *
     * @return array
     */
    public function obtainSignalsFromTransactionHistory(Collection $transactionHistory)
    {
        $purchasedSignals = array();
        foreach ($transactionHistory as $index => $transaction)
        {
            $purchasedSignals[] = $transaction->getOrder()->getAttachedSignal();
        }
        return $purchasedSignals;
    }

    /**
     * @param int $transactionType
     *
     * @return string
     */
    public function getTransactionTypeStr(int $transactionType)
    {
        if ($transactionType === Transaction::TYPE_PAYMENT)
        {
            return 'payment';
        }
        elseif ($transactionType === Transaction::TYPE_INCOME)
        {
            return 'income';
        }
        elseif ($transactionType === Transaction::TYPE_REFUND)
        {
            return 'refund';
        }
        elseif ($transactionType === Transaction::TYPE_ABORT)
        {
            return 'abort';
        }
    }
}