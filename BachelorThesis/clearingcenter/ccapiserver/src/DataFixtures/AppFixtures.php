<?php
namespace App\DataFixtures;

use App\Entity\{Strategy, User, UserWallet};
use App\Repository\{StrategyRepository, UserRepository, UserWalletRepository};
use App\Service\IndicatorService;
use App\Service\MarketService;
use App\Service\StrategyService;
use App\Service\StrategyStatisticsService;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    /**
     * @var MarketService
     */
    private $marketService;
    /**
     * @var IndicatorService
     */
    private $indicatorService;
    /**
     * @var StrategyService
     */
    private $strategyService;
    /**
     * @var UserRepository
     */
    private $userRepository;
    /**
     * @var UserWalletRepository
     */
    private $userWalletRepository;
    /**
     * @var StrategyRepository
     */
    private $strategyRepository;
    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;
    /**
     * @var StrategyStatisticsService
     */
    private $strategyStatisticsService;

    public function __construct(
        MarketService $marketService,
        IndicatorService $indicatorService,
        StrategyService $strategyService,
        UserRepository $userRepository,
        StrategyRepository $strategyRepository,
        UserPasswordEncoderInterface $encoder,
        UserWalletRepository $userWalletRepository,
        StrategyStatisticsService $strategyStatisticsService
    )
    {
        $this->marketService = $marketService;
        $this->indicatorService = $indicatorService;
        $this->strategyService = $strategyService;
        $this->userRepository = $userRepository;
        $this->userWalletRepository = $userWalletRepository;
        $this->strategyRepository = $strategyRepository;
        $this->strategyStatisticsService = $strategyStatisticsService;
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        if ( ($previousUserRoot = $this->userRepository->findOneBy(['email' => "root@root.com"])) !== null)
        {
            $manager->remove($previousUserRoot);
            $manager->flush();
        }
        if ( ($previousUserAndrew = $this->userRepository->findOneBy(['email' => "andrew@gmail.com"])) !== null)
        {
            $manager->remove($previousUserAndrew);
            $manager->flush();
        }
        if ( ($previousUserNiki = $this->userRepository->findOneBy(['email' => "niki@gmail.com"])) !== null)
        {
            $manager->remove($previousUserNiki);
            $manager->flush();
        }

        $root = new User();
        $root->setEmail("root@root.com");
        $root->setPassword($this->encoder->encodePassword($root, "root"));
        $root->setDisplayName("root");
        $root->setStatus(User::STATUS_ACTIVE);
        $wallet = new UserWallet();
        $this->userWalletRepository->add($wallet);
        $root->setWallet($wallet);
        $wallet->setOwner($root);
        $this->userRepository->add($root);



        $andrew = new User();
        $andrew->setEmail("andrew@gmail.com");
        $andrew->setPassword($this->encoder->encodePassword($andrew, "andrew"));
        $andrew->setDisplayName("Babushkin Andrew");
        $andrew->setStatus(User::STATUS_ACTIVE);
        $andrewWallet = new UserWallet();
        $this->userWalletRepository->add($andrewWallet);
        $andrew->setWallet($andrewWallet);
        $andrewWallet->setOwner($andrew);
        $this->userRepository->add($andrew);



        $andrewStrategy = new Strategy('Andrew Prediction');
        $andrewStrategy->setAbout('Andrew believe it will work fine, but honestly, i don\'t think so');
        $andrewStrategy->setMakerFee(3.4);
        $andrewStrategy->setCreator($andrew);
        $andrewStrategy->setApiKey('babushkinandrewbabushkinandrew01');
        // additional structs required by Strategy's instance constructor (market, statistics, indicators)
        $market = $this->marketService->findMarket('1');
        $statistics = $this->strategyStatisticsService->createStrategyStatisticsPortfolio();
        $indicators = $this->indicatorService->findIndicators(array(1));

        $andrewStrategy->setStatistics($statistics);
        $andrewStrategy->setMarket($market);
        $andrewStrategy->addIndicator($indicators[0]);
        $this->strategyRepository->add($andrewStrategy);
        $andrew->addMyStrategy($andrewStrategy);



        $niki = new User();
        $niki->setEmail("niki@gmail.com");
        $niki->setPassword($this->encoder->encodePassword($niki, "niki"));
        $niki->setDisplayName("Boiko Mykyta");
        $niki->setStatus(User::STATUS_ACTIVE);
        $nikiWallet = new UserWallet();
        $nikiWallet->increaseTotalBalance(400000.5);
        $this->userWalletRepository->add($nikiWallet);
        $niki->setWallet($nikiWallet);
        $nikiWallet->setOwner($niki);
        $this->userRepository->add($niki);
        $this->strategyService->makeSubscribeUnsubscribeAction($niki, $andrewStrategy, true);

    }
}