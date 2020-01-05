<?php

namespace App\Service;

use App\Repository\StrategyRepository;
use App\Entity\{
    Strategy,
    User
};
use App\Service\{
    MarketService,
    IndicatorService,
    UserService,
    FollowingInfoService
};
use App\Exception\BadParameterException;
use DateTime;


class StrategyService
{
    /**
     * @var StrategyRepository
     */
    private $strategyRepository;

    /**
     * @var FollowingInfoService
     */
    private $followingInfoService;

    /**
     * @var MarketService
     */
    private $marketService;

    /**
     * @var IndicatorService
     */
    private $indicatorService;

    /**
     * @var UserService
     */
    private $userService;

    /**
     * @var StrategyStatisticsService
     */
    private $strategyStatisticsService;

    public function __construct(
        StrategyRepository $strategyRepository,
        FollowingInfoService $followingInfoService,
        MarketService $marketService,
        IndicatorService $indicatorService,
        UserService $userService,
        StrategyStatisticsService $strategyStatisticsService
    )
    {
        $this->strategyRepository = $strategyRepository;
        $this->followingInfoService = $followingInfoService;
        $this->marketService = $marketService;
        $this->indicatorService = $indicatorService;
        $this->userService = $userService;
        $this->strategyStatisticsService = $strategyStatisticsService;
    }

    /**
     * @param array $strategyParams
     * @param User $owner
     *
     * @throws BadParameterException if not filled all required fields
     * @throws \Doctrine\Orm\ORMException
     *
     * @return Strategy
     */
    public function createStrategy(array $strategyParams, User $owner): Strategy
    {
        if (!isset($strategyParams['name']) or !isset($strategyParams['about']) or !isset($strategyParams['market'])
            or !isset($strategyParams['fee']))
        {
            throw new BadParameterException("Not filled all required fields");
        }

        $name = $strategyParams['name'];
        if (!$this->checkUniqueStrategyName($name))
        {
            throw new BadParameterException(
                "A strategy with this name already exists.");
        }

        $market = $this->marketService->findMarket((string) $strategyParams['market']);
        $apiKey = $this->generateApiKey();

        $strategy = new Strategy($name);
        $strategy->setAbout($strategyParams['about']);
        $strategy->setMakerFee($strategyParams['fee']);
        $strategy->setMarket($market);
        $strategy->setCreator($owner);
        $strategy->setApiKey($apiKey);

        $statistics = $this->strategyStatisticsService->createStrategyStatisticsPortfolio();
        $strategy->setStatistics($statistics);

        if (isset($strategyParams['indicators']))
        {
            $indicators = $this->indicatorService->findIndicators($strategyParams['indicators']);
            foreach ($indicators as $indicator)
            {
                $strategy->addIndicator($indicator);
            }
        }

        $this->strategyRepository->add($strategy);
        $owner->addMyStrategy($strategy);

        return $strategy;
    }

    /**
     * @param string $id
     *
     * @throws BadParameterException if strategy with such id doesn't exist
     *
     * @return Strategy
     */
    public function findStrategyById(string $id): Strategy
    {
        if (($strategy = $this->strategyRepository->find($id)) === null)
        {
            throw new BadParameterException("Strategy with such id doesn't exist");
        }
        return $strategy;
    }

    /**
     * @param array $response
     * @param Strategy $strategy
     * @param User $user
     */
    public function setParamsForOwnerOrFollower(array &$response, Strategy &$strategy, User &$user)
    {
        if ($this->isStrategyOwner($user, $strategy))
        {
            $response['owns'] = true;
            $response['API'] = $strategy->getApiKey();
        } else {
            $followInfo = $this->followingInfoService->getUserFollowInfoByStrategy(
                $user->getFollowingStrategiesInfo(), $strategy);
            if ($followInfo)
            {
                $response['follow'] = true;
                $response['subscribe'] = $followInfo->getSubscription();
            }
            else
            {
                $response['follow'] = false;
                $response['subscribe'] = false;
            }
        }
    }

    /**
     * @param Strategy $strategy
     * @throws \Exception
     *
     * @return string
     */
    public function getLivenessInMarket(Strategy &$strategy): string
    {
        $nowDate = new DateTime(date('Y-m-d H:i:s'));
        $interval = $strategy->getCreatedAt()->diff($nowDate);
        return $interval->format('%a');
    }

    /**
     * @param User $user
     * @param Strategy $strategy
     * @param bool $followAction
     *
     * @throws \Doctrine\ORM\ORMException
     */
    public function makeFollowUnfollowAction(User &$user, Strategy &$strategy, bool $followAction)
    {
        // follow strategy by related user
        if ($followAction)
        {
            // check if strategy is already followed by user
            if ($this->followingInfoService->getUserFollowInfoByStrategy($user->getFollowingStrategiesInfo(), $strategy) !== null)
            {
                return;
            }
            $this->followingInfoService->addFollowingInfo($user, $strategy, false);

        }
        // unfollow strategy by related user
        else {
            $this->followingInfoService->removeFollowingInfo($user, $strategy);
        }

        $this->userService->updateUser($user);
        $this->updateStrategy($strategy);
    }

    /**
     * @param User $user
     * @param Strategy $strategy
     * @param bool $subscribeAction
     *
     * @throws \Doctrine\ORM\ORMException
     */
    public function makeSubscribeUnsubscribeAction(User &$user, Strategy &$strategy, bool $subscribeAction)
    {
        // update strategy subscription by related user
        if ($this->followingInfoService->createOrUpdateSubscription($user, $strategy, $subscribeAction))
        {
            $this->userService->updateUser($user);
            $this->updateStrategy($strategy);
        }
    }

    /**
     * @param Strategy $strategy
     * @param array $fieldToUpdate
     *
     * @throws BadParameterException
     * @throws \Doctrine\Orm\ORMException
     *
     */
    public function updateStrategyFields(Strategy &$strategy, array &$fieldToUpdate)
    {
        if (isset($fieldToUpdate['name']))
        {
            $nameToUpdate = $fieldToUpdate['name'];
            if ($nameToUpdate != $strategy->getName() && !$this->checkUniqueStrategyName($nameToUpdate))
            {
                throw new BadParameterException("Strategy with such name is already exist");
            }
            // require to add return statement to make full supporting by try-catch statement

            $strategy->setName($nameToUpdate);
        }
        if (isset($fieldToUpdate['about']))
        {
            $strategy->setAbout($fieldToUpdate['about']);
        }
        if (isset($fieldToUpdate['fee']))
        {
            $strategy->setMakerFee($fieldToUpdate['fee']);
        }
        if (isset($fieldToUpdate['market']))
        {
            $market = $this->marketService->findMarket((string)$fieldToUpdate['market']);
            $strategy->setMarket($market);
        }
        if (isset($fieldToUpdate['indicators']))
        {
            $indicatorsId = $fieldToUpdate['indicators'];
            $strategy->removeAllIndicators();

            if (!empty($indicatorsId))
            {
                $indicators = $this->indicatorService->findIndicators($indicatorsId);
                foreach ($indicators as $indicator)
                {
                    $strategy->addIndicator($indicator);
                }
            }
        }
        $this->updateStrategy($strategy);
    }

    /**
     * @param User $user
     * @param Strategy $strategy
     *
     * @return bool
     */
    public function isStrategyOwner(User &$user, Strategy &$strategy): bool
    {
        return ($strategy->getCreator() === $user);
    }

    /**
     * @param Strategy $strategy
     * @throws \Doctrine\Orm\ORMException
     */
    public function updateStrategy(Strategy &$strategy)
    {
        $this->strategyRepository->update($strategy);
    }


    /**
     * @param string $apiKey
     * @throws BadParameterException
     * @return Strategy
     */
    public function findStrategyByApiKey(string $apiKey): Strategy
    {
        if (($strategy = $this->strategyRepository->findOneBy(array('apiKey' => $apiKey))) === null)
        {
            throw new BadParameterException("Not valid API_KEY");
        }
        return $strategy;
    }
    private function checkUniqueStrategyName(string $name): bool
    {
        if (!is_null($this->strategyRepository->findOneBy(array('name' => $name))))
        {
            return false;
        }
        return true;
    }

    /***
     * @return string
     */
    private function generateApiKey(): string
    {
        $secure = true;
        return bin2hex(openssl_random_pseudo_bytes(16, $secure));
    }
}