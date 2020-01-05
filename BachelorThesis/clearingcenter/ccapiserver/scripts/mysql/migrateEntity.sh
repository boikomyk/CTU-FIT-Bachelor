#!/bin/bash
# create new migration
php ./../../bin/console make:migration
# update database to last migration
php ./../../bin/console doctrine:migrations:migrate