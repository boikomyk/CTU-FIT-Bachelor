<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SystemWalletRepository")
 */
class SystemWallet extends WalletAbstract
{
    const TYPE_FREEZE = 1;
    const TYPE_INCOME = 2;

    const PROFIT_PERCENTAGE = 0.2;

    /**
     * @ORM\Column(type="smallint")
     */
    private $type;

    public function getType(): ?int
    {
        return $this->type;
    }

    public function setType(int $type): self
    {
        $this->type = $type;

        return $this;
    }
}
