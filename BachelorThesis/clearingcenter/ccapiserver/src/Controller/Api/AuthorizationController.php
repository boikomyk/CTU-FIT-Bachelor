<?php

namespace App\Controller\Api;

use RuntimeException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as ConfExtra;


class AuthorizationController extends ApiController
{
    /**
     * @ConfExtra\Route("/api/authorization", name="account_authorization", methods={"POST"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_ANONYMOUSLY')")
     *
     * @throws RuntimeException
     */
    public function create()
    {
        throw new RuntimeException('Invalid authentication handlers in your security firewall configuration.');
    }
}