<?php

namespace App\Service;

use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

use App\Repository\{
    UserRepository,
    UserWalletRepository
};
use App\Entity\{
    User,
    UserWallet
};

use App\Exception\{
    BadParameterException,
    UserNotFoundException
};

class UserService
{
    /**
     * @var UserRepository
     */
    private $userRepository;
    /**
     * @var UserWalletRepository
     */
    private $userWalletRepository;
    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(
        UserRepository $userRepository,
        UserPasswordEncoderInterface $encoder,
        UserWalletRepository $userWalletRepository
)
    {
        $this->userRepository = $userRepository;
        $this->userWalletRepository = $userWalletRepository;
        $this->encoder = $encoder;
    }

    /**
     * @param string $username
     * @param string $password
     * @param string $email
     *
     * @throws BadParameterException if the provided registration attribute
     *  is already belongs to other user
     * @throws \Doctrine\Orm\ORMException in case of failed transaction to database
     *
     * @return User
     */
    public function create(string $username, string $password, string $email): User
    {
        $errors = $this->checkUniqueParameter($username, $email);
        if ($errors)
        {
            $errors = implode(" and ", $errors);
            throw new BadParameterException("User with such" . $errors . "is already registered");
        }

        $user = new User();
        $user->setEmail($email);
        $user->setPassword($this->encoder->encodePassword($user, $password));
        $user->setDisplayName($username);

        $wallet = new UserWallet();
        $this->userWalletRepository->add($wallet);

        $user->setWallet($wallet);
        $wallet->setOwner($user);

        $this->userRepository->add($user);

        return $user;
    }

    public function activateUserAccount(User $user)
    {
        $user->setStatus(User::STATUS_ACTIVE);
        $this->userRepository->update($user);
    }

    /**
     * @param string $id
     *
     * @throws UserNotFoundException
     * @return User
     */
    public function read(string $id): ?User
    {
        $user = $this->userRepository->findOneBy(array('id' => $id));

        if (is_null($user))
        {
            throw new UserNotFoundException();
        }

        return $user;
    }

    /**
     * @param User $user
     */
    public function updateUser(User &$user)
    {
        $this->userRepository->update($user);
    }


    private function checkUniqueParameter(string $username, string $email): array
    {
        $errors = [];
        if (!is_null($this->userRepository->findOneBy(array('displayName' => $username))))
        {
            $errors[] = "username";
        }
        if (!is_null($this->userRepository->findOneBy(array('email' => $email))))
        {
            $errors[] = "email";
        }
        return $errors;
    }

}
