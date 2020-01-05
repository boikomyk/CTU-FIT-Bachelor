# Clearing Center
Single Page Application Prototype for Clearing Center Project.
## Quick Start ##
Building application works on macOS, Windows, and Linux.

#### npm  

``` 
npm install
npm run build
```
#### yarn 
``` 
yarn install
yarn run build
```

>It takes some time, most of it is spent installing npm packages.


For more information please see [Build Scripts](#build-scripts) section.
  
## Configuration
### Prepare .env for build configurations ###
For running builds you need to have **.env** in web-app/ folder.
So you can create new one or rename **web-app/.env.default**.  

Inside that file:
 - **REST_API_ENTRY_POINT**  e.g. http://localhost:8080
 - **WS_API_ENTRY_POINT** e.g. ws://localhost:9090
 
### Production 
**`npm run build`** or **`yarn run build`**
>This project is a part of clearing center server, so **build** folder will be located above the **web-app/** folder, in **public/build**.

### Development
**`npm run dev`** or **`yarn run dev`**
>It  will start a server instance and begin listening for connections from localhost on port 8080. 
It supports live-reload of files as you edit your assets while the server is running.


## Author

Mykyta Boiko [boikomyk@fit.cvut.cz](boikomyk@fit.cvut.cz)
