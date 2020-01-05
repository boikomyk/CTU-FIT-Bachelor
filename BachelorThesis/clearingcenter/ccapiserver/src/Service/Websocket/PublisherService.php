<?php

namespace App\Service\Websocket;

use Voryx\ThruwayBundle\Client\ClientManager;

class PublisherService
{
    /**
     * @var ClientManager
     */
    private $clientManager;

    /**
     * @param ClientManager $clientManager
     */
    public function __construct
    (
        ClientManager $clientManager
    )
    {
        $this->clientManager = $clientManager;
    }

    /**
     * @param array $authids List of user's unique identificators (emails)
     * @param array $dataToNotify data that's used in notification message
     *
     * @throws \Exception
     */
    public function publish(array $authids, array $dataToNotify)
    {
        $this->clientManager->publish('websocket.subscription', [$dataToNotify], [], ['_thruway_eligible_authids' => $authids]);
    }
}
