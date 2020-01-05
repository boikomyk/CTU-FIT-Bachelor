<?php

namespace App\Exception;

use Exception;

class InvalidTokenException extends \Exception
{

    public function __construct($mess = null, $code = null , Exception $previous = null) {
        parent::__construct($mess, $code, $previous);
    }

}