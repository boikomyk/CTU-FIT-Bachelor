<?php

namespace App\Service;

use App\Exception\InvalidTokenException;

use App\Entity\{User, UserToken};
use App\Repository\{UserTokenRepository, UserRepository};
use App\Mailer\AccountMailer;

use Ramsey\Uuid\Uuid;


class UserTokenService
{
    /**
     * @var UserTokenRepository
     */
    private $userTokenRepository;
    /**
     * @var UserRepository
     */
    private $userRepository;
    /**
     * @var AccountMailer
     */
    private $accountMailer;

    public function __construct(
        UserTokenRepository $userTokenRepository,
        UserRepository $userRepository,
        AccountMailer $accountMailer
    )
    {
        $this->userTokenRepository = $userTokenRepository;
        $this->userRepository = $userRepository;
        $this->accountMailer = $accountMailer;
    }

    /**
     * @param User $user
     * @param int $tokenType
     */
    public function createToken(User $user, int $tokenType)
    {
        $userToken = new UserToken($user, $tokenType);


        $this->userTokenRepository->add($userToken);
        $this->sendNotificationMail($userToken);
    }

    /**
     * @param string $username
     * @param string $hash
     * @param int $tokenType
     *
     * @throws InvalidTokenException
     *
     * @return UserToken
     */
    public function getExistingToken(string $username, string $hash, int $tokenType): UserToken
    {
        if (!Uuid::isValid($hash)) {
            throw new InvalidTokenException();
        }
        if (($userToken = $this->userTokenRepository->find($hash)) == null)
        {
            throw new InvalidTokenException();
        }
        if ($userToken->getType() != $tokenType or $userToken->getUser()->getDisplayName() != $username)
        {
            throw new InvalidTokenException();
        }

        return $userToken;
    }

    /**
     * @param UserToken $userToken
     */
    public function removeUnusedToken(UserToken $userToken)
    {
        $this->userTokenRepository->remove($userToken);
    }

    /**
     * @param UserToken $userToken
     */
    private function sendNotificationMail(UserToken $userToken)
    {
        if ($userToken->getType() == UserToken::TYPE_ACCOUNT_ACTIVATION)
        {
            $this->accountMailer->sendConfirmationEmailMessage($userToken);
        }
    }

}