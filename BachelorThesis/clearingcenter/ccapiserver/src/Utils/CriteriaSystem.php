<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 2019-04-15
 * Time: 06:32
 */

namespace App\Utils;


use Doctrine\Common\Collections\Criteria;

class CriteriaSystem
{
    /**
     * @param string $sortByAttribute
     * @param string $sortingOder
     *
     * @return Criteria
     */
    public static function createOrderByCriteria(string $sortByAttribute, string $sortingOder)
    {
        $criteria = Criteria::create()
            ->orderBy(array($sortByAttribute => $sortingOder));
        return $criteria;
    }
}