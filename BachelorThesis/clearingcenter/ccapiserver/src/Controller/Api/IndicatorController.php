<?php

namespace App\Controller\Api;

use Sensio\Bundle\FrameworkExtraBundle\Configuration as ConfExtra;
use Symfony\Component\HttpFoundation\JsonResponse;

use App\Repository\IndicatorRepository;

class IndicatorController extends ApiController
{
    /**
     * @var IndicatorRepository
     */
    private $indicatorRepository;


    public function __construct(
        IndicatorRepository $indicatorRepository
    )
    {
        $this->indicatorRepository = $indicatorRepository;
    }

    /**
     * @ConfExtra\Route("/api/indicators", name="read_available_indicators", methods={"GET"})
     * @ConfExtra\Security("is_granted('IS_AUTHENTICATED_FULLY')")
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $availableIndicators = $this->indicatorRepository->findAll();
        if (count($availableIndicators) === 0) {
            return new JsonResponse(['message' => 'No indicators available'], JsonResponse::HTTP_NOT_FOUND);
        }
        $response = [];
        foreach ($availableIndicators as $indicator) {
            $response['indicators'][] = [
                'id' => $indicator->getID(),
                'name' => $indicator->getStrRepresentation(),
            ];
        }
        return new JsonResponse($response);
    }
}