# smart-home-alexa-and-google

Project to control smart devices through Google Home and Amazon Alexa. The idea is to centralize the status and information of your home devices in a single application, so that when adding a new device it appears in both Google Home and Amazon Alexa, and orders and status changes can be sent to both assistants, and at the same time each assistant shows the updated status of the device regardless of who sent the order.

[Haga click aquí para ir a leame en español](https://github.com/pablotoledom/smart-home-alexa-and-google/blob/master/leame.md)

## Starting 🚀

This project is large, it uses a mixture of many technologies, although I have tried to use the same language (JavaScript) for the entire project, it is still a challenge that takes a long time to implement, today I calculate that I will build the server it could take 2 days.

This repository is part of the project that I have implemented in my house, I never thought that it would take me so long to get to what I have today (2 years approx, since I could only advance in my free time and sometimes months went by without advancing). That is why I have made a 13-step guide where I detail each step of the development (being a large project, this guide also helps me to support it in the future), I leave the following link to whoever needs it.

https://loqueseaqueaprenda.blogspot.com/2020/03/proyecto-demotica-parte-1-arquitectura.html  

Some things we will see are:

- Mount Raspberry Pi with Ubuntu Server
- Oauth 2 authentication server
- Web server on NodeJS Express
- SSL certified web service through Letsencrypt.org
- Frontend in Polymer 3
- Backend in NodeJS
- Data persistence in MongoDB
- Dynamic domains (using Google domain)
- Create third party service in Google Actions
- Create third party service in Alexa Skills
- Execute calls to ESPurna

Currently I have this project running on a Raspberry Pi 2 machine as a server, and it has given me excellent results, its low consumption and silence, makes the hardware go very unnoticed. Additionally, I am using hardware compatible with ESPURNA to control the devices through 433Mhz radio frequency commands, and in the future I plan to program the commands for infrared control.


### Pre-requisites 📋

Server with operating system compatible with the following software versions:

- NodeJs Minimum v10.16.3, recommended v12.18.3
- NPM minimum 6.11.3, recommended 6.14.7
- MongoDB minimum 3.0.14, recommended 3.6.8

The production server must be accessible from a public domain with SSL certification (port 443), otherwise it will not be able to link from the Amazon Skill or Google Actions, in addition the environment or operating system must redirect the http calls to the following ports:

- 80 -> 8080
- 443 -> 8443

Since for security reasons the application does not directly use ports 80 and 443.

### Installation 🔧

#### 1) Clone the proyect from Github

Run the following command on your console

```console
git clone https://github.com/pablotoledom/smart-home-alexa-and-google.git
```

#### 2) Install the node_modules dependencies

Run the following commands in your terminal

```console
cd smart-home-alexa-and-google

npm install

npm audit fix

```

#### 3) Add the configuration data

##### 3.1 Update the data base connection string

Open the "database-setup.js" file found in the "connections" directory.

replace the string mongodb://user:password@localhost, with your connection data depending on the environments you have available.

##### 3.2 Update routes to SSL certificates

Open the file "ssl-setup.js" found in the "connections" directory.

replace the paths to the privkey.pem, cert.pem, chain.pem files, the path that comes by default is the one used in systems with Ubuntu Server.

##### 3.3 Define the following environment variable as the case may be

If you are going to run the project on your local machine without an SSL certificate, you should not declare any variables.

```console
export ENVIROMENT=IN_NETWORK  
```
```console
export ENVIROMENT=REMOTE  
```
```console
export ENVIROMENT=PRODUCTION  
```  

##### 3.4 Add the ID and Secret Key for our web client

Define an ID and Secret Key, these two values must be encrypted in Base64 and must be added in line 98 of the my-login.js file.

Example: if you define the following values "mySuperId", "mySuperSecretKey" as your id and key respectively, you could use the following website https://www.base64encode.org/ to encrypt them in Base64. You must use the following format mySuperId:mySuperSecretKey resulting in the following string bXlTdXBlcklkOm15U3VwZXJTZWNyZXRLZXk= 

Once you have it, replace line 98 of the "my-login.js" file located in the "frontend" directory, the string should be similar to the one included as an example:
'Basic bXlTdXBlcklkOm15U3VwZXJTZWNyZXRLZXk ='.

#### 4) Add the initial data to your MongoDB database

Run the initial database script

```console
node ./example-data/example-data-mongo.js
```

Once the execution is finished, the documents just added to the database will be displayed in the terminal, after this step you will have a project that can be started and viewed from a web browser

#### 5) Ejecuta el servidor Web
#### 5) Run the Web server

```console
npm start
```

## Running the tests ⚙️

The server gets up on port 8080 (without SSL) and on port 8443 (with SSL), to view the frontend and the services, access the corresponding IP from your web browser.

If you have mounted the project on a server, access it from the domain or from the server's IP.

If you have mounted the project on your local machine go to

```
http://localhost:8080/
```

### Use the sample account

#### User:

```
myUserName
```

#### Password:

```
smarthome
```

If everything went well, you should be able to see the login screen and upon logging in you should see a test device. Add new devices!.

![alt text](https://1.bp.blogspot.com/-AO_FmG7hNWU/X1vCapafzbI/AAAAAAAA668/iDmELl1AlpQsLFme1nOJVkE81emxpCUEwCLcBGAsYHQ/s1580/Sin%2Bnombre.jpg)


## Deployment 📦

To continue with this project, the third-party service must be created within your assistant, then I leave the links for the assistant you use or if you wish for both.

### 1) Create a Google assistant Actions and link to your server

https://loqueseaqueaprenda.blogspot.com/2020/09/proyecto-domotica-parte-11-crear.html


### 2) Create an Amazon Alexa Skill and link to your server

https://loqueseaqueaprenda.blogspot.com/2020/09/proyecto-domotica-parte-12-crear.html


## Author

Pablo Toledo


## Licence 📄

This project is under the Apache License, Version 2.0 - see the file [LICENCIA.md](LICENSE.md) for more details.

## Expressions of Gratitude 🎁

- Thanks to [Pedro Trujillo](https://github.com/pedroetb) for the examples to mount an Oauth 2 server with NodeJS and MongoDB
- Thanks to the Google Actions community for the web project in Polymer 3 on Firebase that I used as a basis for managing the devices [Actions On Google](https://github.com/actions-on-google)
- Thanks to the Alexa community for the available examples [Alexa](https://github.com/alexa/)
- Thanks to [Andrés Villanueva](https://github.com/Villanuevand) for the guide to build the readme