<?php
declare(strict_types=1);

namespace App\Tests;

use App\Entity\User;
use App\Service\UserService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;


final class UserServiceTest extends TestCase
{
    public function testCannotBeCreatedUserWithInvalidEmail(): void
    {
        /** @var UserService | MockObject $userService */
        $userService = $this->createMock(UserService::class);
        try{
            $user = $userService->create('uniq','uniq1234','invalid');
            $this->fail("Created user with invalid email");
        } catch (\Exception $e)
        {
            $this->addToAssertionCount(1);
        }
    }

    public function testCanBeCreatedUserWithValidParameters(): void
    {
        /** @var UserService | MockObject $userService */
        $userService = $this->createMock(UserService::class);
        try{
            $user = $userService->create('uniq','uniq1234','niki@gmail.com');
            $this->assertInstanceOf(User::class, $user);
        } catch (\Exception $e)
        {
            $this->fail("Cannot be created user with valid parameters");
        }
    }

    public function testCannotBeFoundUserWithInvalidId(): void
    {
        /** @var UserService | MockObject $userService */
        $userService = $this->createMock(UserService::class);
        try{
            $user = $userService->read('-100');
            $this->fail("Was founded user with invalid negative id");
        } catch (\Exception $e)
        {
            $this->addToAssertionCount(1);
        }
    }

}