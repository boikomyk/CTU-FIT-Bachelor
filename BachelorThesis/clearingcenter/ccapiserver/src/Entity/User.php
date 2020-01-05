<?php

namespace App\Entity;

use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

use Serializable;
use Symfony\Component\Security\Core\User\EquatableInterface;
use Symfony\Component\Security\Core\User\UserInterface;

use DateTimeImmutable;
use DateTime;


/**
 * @ORM\EntityListeners({"App\Listener\Entity\UserListener"})
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class User implements UserInterface, Serializable, EquatableInterface
{
    const ROLE_USER = 1;
    const ROLE_DEVELOPER = 2;
    const ROLE_ADMIN = 3;

    const STATUS_INACTIVE = 0;
    const STATUS_ACTIVE = 1;
    const STATUS_CLOSED = 2;
    const STATUS_BLOCKED = 3;


    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=250, unique=true)
     */
    private $displayName;

    /**
     * @ORM\Column(type="integer")
     */
    private $role = self::ROLE_USER;

    /**
     * @ORM\Column(type="integer")
     */
    private $status = self::STATUS_INACTIVE;

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     *
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $lastLoginAt;

    /**
     * @ORM\OneToMany(targetEntity="UserToken", mappedBy="user", cascade={"persist", "remove"})
     *
     * @var ArrayCollection
     */
    private $tokens;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Strategy", mappedBy="creator", orphanRemoval=true)
     */
    private $myStrategies;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\FollowingInfo", mappedBy="user", orphanRemoval=true)
     */
    private $followingStrategiesInfo;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\UserWallet", inversedBy="owner", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $wallet;


    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->tokens = new ArrayCollection();
        $this->myStrategies = new ArrayCollection();
        $this->followingStrategiesInfo = new ArrayCollection();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getDisplayName(): string
    {
        return (string) $this->displayName;
    }


    public function setDisplayName(string $displayName): self
    {
        $this->displayName = $displayName;

        return $this;
    }


    public function getRole(): int
    {
        return $this->role;
    }

    public function setRole(int $role): self
    {
        $this->role = $role;

        return $this;
    }

    /**
     * @return int
     */
    public function getStatus(): int
    {
        return $this->status;
    }

    /**
     * @param int $status
     */
    public function setStatus(int $status)
    {
        $this->status = $status;
    }

    /**
     * @param string $strFormat
     *
     * @return DateTime|string|null
     */
    public function getUpdatedAt(string $strFormat = null)
    {
        if ($this->updatedAt !== null && $strFormat !== null) {
            return (clone $this->updatedAt)->format($strFormat);
        }
        return $this->updatedAt;
    }

    /**
     * @param DateTimeImmutable $updatedAt
     */
    public function setUpdatedAt(DateTimeImmutable $updatedAt)
    {
        $this->updatedAt = $updatedAt;
    }

    /**
     * @param string $strFormat
     * @return DateTime|string|null
     */
    public function getLastLoginAt(string $strFormat = null)
    {
        if ($this->lastLoginAt !== null && $strFormat !== null) {
            return (clone $this->lastLoginAt)->format($strFormat);
        }
        return $this->lastLoginAt;
    }

    /**
     * @param DateTimeImmutable $lastLoginAt
     */
    public function setLastLoginAt(DateTimeImmutable $lastLoginAt)
    {
        $this->lastLoginAt = $lastLoginAt;
    }

    /**
     * @return ArrayCollection
     */
    public function getTokens(): ArrayCollection
    {
        return $this->tokens;
    }

    /**
     * @param string $strFormat|null
     * @return DateTime|string
     */
    public function getCreatedAt(string $strFormat = null)
    {
        if ($strFormat !== null)
        {
            return (clone $this->createdAt)->format($strFormat);
        }
        return $this->createdAt;
    }

    /*___________________________ USER_INTERFACE__________________________\/__*/
    /**
     * {@inheritdoc}
     *  @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * {@inheritdoc}
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $userRoles = array();

        if ($this->role == self::ROLE_DEVELOPER)
        {
            $userRoles[] = 'ROLE_DEVELOPER';
        }
        if ($this->role <= self::ROLE_USER)
        {
            $userRoles[] = 'ROLE_USER';
        }
        return $userRoles;
    }

    /**
     * {@inheritdoc}
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * {@inheritdoc}
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    /*___________________________ USER_INTERFACE__________________________/\__*/

    /*___________________________ SERIALIZE__________________________\/__*/
    /**
     * {@inheritdoc}
     */
    public function serialize()
    {
        return serialize([
            $this->id,
            $this->email,
            $this->password,
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function unserialize($serialized)
    {
        list(
            $this->id,
            $this->email,
            $this->password,
            ) = unserialize($serialized);
    }
    /*___________________________ SERIALIZE__________________________/\__*/

    public function isEqualTo(UserInterface $user)
    {
        return $this->getId() == $user->getId();
    }

    /**
     * @return Collection|Strategy[]
     */
    public function getMyStrategies(): Collection
    {
        return $this->myStrategies;
    }

    public function addMyStrategy(Strategy $myStrategy): self
    {
        if (!$this->myStrategies->contains($myStrategy)) {
            $this->myStrategies[] = $myStrategy;
            $myStrategy->setCreator($this);
        }

        return $this;
    }

    public function removeMyStrategy(Strategy $myStrategy): self
    {
        if ($this->myStrategies->contains($myStrategy)) {
            $this->myStrategies->removeElement($myStrategy);
            // set the owning side to null (unless already changed)
            if ($myStrategy->getCreator() === $this) {
                $myStrategy->setCreator(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|FollowingInfo[]
     */
    public function getFollowingStrategiesInfo(): Collection
    {
        return $this->followingStrategiesInfo;
    }

    public function addFollowingStrategyInfo(FollowingInfo $followingStrategyInfo): self
    {
        if (!$this->followingStrategiesInfo->contains($followingStrategyInfo)) {
            $this->followingStrategiesInfo[] = $followingStrategyInfo;
            $followingStrategyInfo->setUser($this);
        }

        return $this;
    }

    public function removeFollowingStrategyInfo(FollowingInfo $followingStrategyInfo): self
    {
        if ($this->followingStrategiesInfo->contains($followingStrategyInfo)) {
            $this->followingStrategiesInfo->removeElement($followingStrategyInfo);
            // set the owning side to null (unless already changed)
            if ($followingStrategyInfo->getUser() === $this) {
                $followingStrategyInfo->setUser(null);
            }
        }

        return $this;
    }

    public function getWallet(): ?UserWallet
    {
        return $this->wallet;
    }

    public function setWallet(UserWallet $wallet): self
    {
        $this->wallet = $wallet;

        return $this;
    }

}
