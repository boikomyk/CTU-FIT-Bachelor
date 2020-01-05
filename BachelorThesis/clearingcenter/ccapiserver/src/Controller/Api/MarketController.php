<?php

namespace App\Controller\Api;

use Sensio\Bundle\FrameworkExtraBundle\Configuration as ConfExtra;
use Symfony\Component\HttpFoundation\JsonResponse;

use App\Repository\MarketRepository;

class MarketController extends ApiController
{
    /**
     * @var MarketRepository
     */
    private $marketRepository;


    public function __construct(
        MarketRepository $marketRepository
    )
    {
        $this->marketRepository = $marketRepository;
    }

    /**
     * @ConfExtra\Route("/api/markets", name="read_available_markets", methods={"GET"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_FULLY')")
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $availableMarkets = $this->marketRepository->findAll();
        if (count($availableMarkets) === 0) {
            return new JsonResponse(['message' => 'No markets available'], JsonResponse::HTTP_NOT_FOUND);
        }
        $response = [];
        foreach ($availableMarkets as $market) {
            $response['markets'][] = [
                'id' => $market->getID(),
                'name' => $market->getStrRepresentation(),
            ];
        }
        return new JsonResponse($response);
    }
}