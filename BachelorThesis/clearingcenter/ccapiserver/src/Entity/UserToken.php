<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;


use Ramsey\Uuid\Uuid;

use DateTime, DateTimeImmutable, DateInterval;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserTokenRepository")
 */
class UserToken
{
    const TYPE_ACCOUNT_ACTIVATION = 1;
    const TYPE_RESET_PASSWORD = 2;

    const TTL_ACCOUNT_ACTIVATION = 'PT24H';
    const TTL_RESET_PASSWORD = 'PT24H';

    /**
     * @ORM\Column(type="uuid", unique=true)
     * @ORM\Id()
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class="Ramsey\Uuid\Doctrine\UuidGenerator")
     */
    private $uuid;

    /**
     * @ORM\Column(type="integer")
     */
    private $userID;

    /**
     * @ORM\Column(type="integer")
     */
    private $type;

    /**
     * @ORM\Column(type="datetime")
     *
     * @var DateTime
     */
    private $createdAt;
    /**
     * @ORM\Column(type="datetime", nullable=true)
     *
     * @var DateTime|null
     */
    private $usedAt;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="tokens")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     *
     * @var User
     */
    private $user;

    /**
     * @param User $user
     * @param int $type
     */
    public function __construct(User $user, int $type)
    {
        $this->user = $user;
        $this->type = $type;
        $this->createdAt = new DateTimeImmutable();
    }

    /**
     * @return string
     */
    public function getUUID(): string
    {
        return (string) $this->uuid;
    }

    /**
     * @return int
     */
    public function getUserID(): int
    {
        return $this->userID;
    }

    /**
     * @param DateTimeImmutable $usedAt
     */
    public function setUsedAt(DateTimeImmutable $usedAt)
    {
        $this->usedAt = $usedAt;
    }

    /**
     * @return int
     */
    public function getType(): int
    {
        return $this->type;
    }

    /**
     * @param string $format
     *
     * @return DateTime
     */
    public function getCreatedAt(): DateTime
    {
        return $this->createdAt;
    }

    /**
     * @param string $format
     *
     * @return DateTime|null
     */
    public function getUsedAt(): ?DateTime
    {
        return $this->usedAt;
    }

    /**
     * @return User
     */
    public function getUser(): User
    {
        return $this->user;
    }

    /**
     * @return bool
     * @throws \Exception
     */
    public function isExpired(): bool
    {
        if ($this->type === self::TYPE_ACCOUNT_ACTIVATION) {
            $expiredAt = (clone $this->createdAt)->add(new DateInterval(self::TTL_ACCOUNT_ACTIVATION));
            if ($expiredAt < new DateTimeImmutable()) {
                return true;
            }
        }
        elseif ($this->type === self::TYPE_RESET_PASSWORD) {
            $expiredAt = (clone $this->createdAt)->add(new DateInterval(self::TTL_RESET_PASSWORD));
            if ($expiredAt < new DateTimeImmutable()) {
                return true;
            }
        }
        //other conditions!
        return false;
    }
}
