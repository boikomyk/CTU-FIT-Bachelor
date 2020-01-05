<?php
declare(strict_types=1);

namespace App\Tests;

use App\Entity\User;
use App\Entity\UserToken;
use App\Service\UserTokenService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;


final class UserTokenServiceTest extends TestCase
{
    public function testCannotBeCreatedTokenWithInvalidUser(): void
    {
        /** @var UserTokenService | MockObject $userTokenService */
        $userTokenService = $this->createMock(UserTokenService::class);
        try{
            $userTokenService->createToken(new User(), UserToken::TYPE_ACCOUNT_ACTIVATION);
            $this->fail("Token for invalid user was created");
        } catch (\Exception $e)
        {
            $this->addToAssertionCount(1);
        }
    }

    public function testCannotBeFindTokenByInvalidParameters(): void
    {
        /** @var UserTokenService | MockObject $userTokenService */
        $userTokenService = $this->createMock(UserTokenService::class);
        try{
            $userTokenService->getExistingToken('invalid', 'invalid',UserToken::TYPE_ACCOUNT_ACTIVATION);
            $this->fail("Obtained token using invalid parameters");
        } catch (\Exception $e)
        {
            $this->addToAssertionCount(1);
        }
    }
}