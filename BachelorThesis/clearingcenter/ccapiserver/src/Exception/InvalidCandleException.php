<?php

namespace App\Exception;

use Exception;

class InvalidCandleException extends \Exception
{
    const MESSAGE = "Received candle doesn't match any signal";

    public function __construct($code = 422, Exception $previous = null) {
        parent::__construct(self::MESSAGE, $code, $previous);
    }

    public function __toString() {
        return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
    }

}