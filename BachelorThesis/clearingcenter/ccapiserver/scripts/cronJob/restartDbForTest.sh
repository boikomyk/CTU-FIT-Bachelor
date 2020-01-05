#!/bin/bash
cd ..
cd mysql/
./dropAndUpdateForceSchema.sh
./insertMysql.sh
cd ..
./initialSetupData.sh
cd cronJob/