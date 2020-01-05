#!/bin/bash
php ./../../bin/console doctrine:cache:clear-metadata
php ./../../bin/console doctrine:schema:drop --force
php ./../../bin/console doctrine:schema:update --force