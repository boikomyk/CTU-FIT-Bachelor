<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 2019-04-10
 * Time: 13:33
 */

namespace App\Utils;


use App\Entity\CryptoSignal;

class ValidationAuditor
{
    const CORRECT_PREDICTION = true;
    const BAD_PREDICTION     = false;

    /**
     * @param CryptoSignal $signal
     *
     * @return bool
     */
    public static function validatePrediction(CryptoSignal $signal): bool
    {
        // Set min and max of possible interpretation types
        $minPossibleInterpretationType = CryptoSignal::ACTION_SELL;
        $maxPossibleInterpretationType = CryptoSignal::ACTION_BUY;

        // function it's returned value imitate auditor decision about provided signal interpretation
        $checkIfPredictionValid = function($signalInterpretation) use ($minPossibleInterpretationType, $maxPossibleInterpretationType){
            return ($signalInterpretation === random_int($minPossibleInterpretationType, $maxPossibleInterpretationType));
        };

        // get signal action type provided by strategy developer
        $signalInterpretation = $signal->getAction();
        // make auditor to decide if prediction was valid
        $auditorDecision = $checkIfPredictionValid($signalInterpretation);
        return $auditorDecision;
    }
}