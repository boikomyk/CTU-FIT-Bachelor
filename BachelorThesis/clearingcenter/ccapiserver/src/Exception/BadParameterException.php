<?php

namespace App\Exception;

use Exception;

class BadParameterException extends \Exception
{
    public function __construct($message, $code = 409, Exception $previous = null) {
        parent::__construct($message, $code, $previous);
    }

    public function __toString() {
        return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
    }

}