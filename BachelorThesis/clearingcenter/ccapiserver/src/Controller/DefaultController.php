<?php

namespace App\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;


class DefaultController extends AbstractController
{
    /**
     * @Template("default/index.html.twig")
     * @Route("/{reactRouting}", name="index", requirements={"reactRouting"="^(?!api|_(profiler|wdt|js)).*"}, defaults={"reactRouting": null})
     * @Security("is_granted('IS_AUTHENTICATED_ANONYMOUSLY')")
     */
    public function indexAction()
    {
        return [];

    }
}