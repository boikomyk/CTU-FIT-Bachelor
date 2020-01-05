<?php

namespace App\Exception;

use Exception;

class InvalidEmailFormatException extends \Exception
{
    const MESSAGE = "Invalid email format";

    public function __construct($code = 409, Exception $previous = null) {
        parent::__construct(self::MESSAGE, $code, $previous);
    }

    public function __toString() {
        return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
    }

}