Contents of CD:
|readme.txt ....................... the file with CD contents description
||__src.......................................the directory of source codes| || |__platform......................the directory of platform source code| || |__thesis..............the directory of LATEX source codes of the thesis|   ||   |__figures .............................. the thesis figures directory|   ||   |__*.tex .................... the LATEX source code files of the thesis||__text..........................................the thesis text directory  |  |__thesis.pdf ...................... the Bachelor thesis in PDF format


Clearing Centre platform directory structure:
 -  clearingcenter/ccapiserver         - server
 -  clearingcenter/ccapiserver/web-app - client


Before installing the software, your system should satisfy the following conditions:

Predefined requirements:
 1. Apache HTTP Server 2.4.*
 2. MySql Server ^5.7
 3. PHP ^7.1.3


Installation Guide:
1. Change the apache DirectoryIndex to : DirectoryIndex index.html index.php
   and VirtualHost points to: clearingcenter/ccapiserver/public.

2. Create schema named "clearingCenterDev" in MySql Server.

3. Create SMTP server and change line "MAILER_URL=your smtp server" in clearingcenter/ccapiserver/.env file.

4. Generate your public and private key using PASSPHRASE=FITT with following command:
    `openssl genrsa -out var/jwt/private.pem -aes256 4096`
    `openssl rsa -pubout -in var/jwt/private.pem -out var/jwt/public.pem`
   and move them clearingcenter/ccapiserver/config/jwt/*.
   In case you user your custom PASSPHRASE, change relevant line in clearingcenter/ccapiserver/.env file.

5. Open command line in directory clearingcenter/ccapiserver/ and execute following command: (installing the defined dependencies for project)
   `composer install`

6. Go to web-client directory clearingcenter/ccapiserver/web-app/ and do the following:
   
   6.1. Install all required dependencies
         `npm install`  or  `yarn install`
        It takes some time, most of it is spent installing npm packages

   6.2. Prepare .env for build configurations
        For running builds you need to have .env in web-app/ folder. So you can create new one or rename web-app/.env.default. Inside that file:
         * REST_API_ENTRY_POINT e.g. http://localhost:8080
         * WS_API_ENTRY_POINT e.g. ws://localhost:9090
  
   6.3. Build project:
         - Production
            `npm run build` or `yarn run build`
           This project is a part of clearing center server, so build folder will be located above the web-app/ folder, in public/build.
         - Development
           `npm run dev` or `yarn run dev`
           It will start a server instance and begin listening for connections from localhost on port 8080. It supports live-reload of files as you edit your assets while the server is running.


7. Start Apache and MySql Server.

8. Start WEB SOCKET Server
   in directory clearingcenter/ccapiserver/ run the following:
    `bin/console thruway:process start`

9. Install required initial setup data:
    `cd scripts/mysql && ./dropAndUpdateForceSchema.sh && insertMysql.sh` #update your "clearingCenterDev" database schema

10. It's finish. Now, Clearing center is running, enjoy it. 


?11. Not required step. Just useful small tutorial about rest content of project:
   
      In directory clearingcenter/ccapiserver/scripts:
        - initialSetupData.sh   #load test data: spawn several users with different roles, make subscribe actions etc
        - apiRoute.sh           #display all Rest API routes
        - mysql/createEntity    #allows to add new Entities or extend already exist entities in database
      
      In directory clearingcenter/ccapiserver/scripts/cronJob:
        Regrading this directory, it allows to simulate strategy developer behaviour.
        - restartDbForTest.sh == `./dropAndUpdateForceSchema.sh && ./insertMysql.sh && ./initialSetupData.sh` #clear and update database schema, load initial data and test data
        - sendDevData.js argv   #send crypto signals and candles to server, 2 cases of use:
            - `./sendDevData.js`           #required executing `./initialSetupData.sh` before it, that would add developer Andrey, his behaviour sendDevData.js script would be simulate (use his API developer key)
	    - `./sendDevData.js API_KEY`   #same as previous, but in this case, will simulate behaviour of developer, whose API_KEY is provided as input for script
      

     
Author
Mykyta Boiko boikomyk@fit.cvut.cz