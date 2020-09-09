# smart-home

Proyecto para control de dispositivos inteligentes por medio de Google Home y Amazon Alexa. 
Utiliza una base de datos MongoDB para persistir los dispositivos agregados.

## Comenzando 🚀



Mira **Deployment** para conocer como desplegar el proyecto.


### Pre-requisitos 📋

Servidor con sistema operativo compatible con las siguientes versiones de software:

NodeJs mínimo v10.16.3, recomendado v12.18.3
NPM mínimo 6.11.3, recomendado 6.14.7
MongoDB minimo 3.0.14, recomendado 

El servidor debe ser accesible desde un dominio público con certificación SSL (puerto 443)


### Instalación 🔧

1) Definir la siguiente variable de entorno según sea el caso, si va a correr el proyecto en su maquina local sin un certificado SSL, no debe declarar ninguna variable.

export ENVIROMENT=IN_NETWORK
export ENVIROMENT=REMOTE
export ENVIROMENT=IPRODUCTION

2) clonar el proyecto

git clone https://github.com/pablotoledom/smart-home-alexa-and-google.git

3) Instalar las dependencias en node_modules

npm install

npm audit fix

4) Agregar los datos de configuración

4.1 Actualizar la cadena de conexión a la base de datos

Abra el archivo "database-setup.js" que se encuentra en el directorio "connections".

reemplace la cadena mongodb://user:password@localhost, por sus datos de conexión según los ambientes que tenga disponibles.

4.2 Actualizar las rutas hacia los certificados SSL

Abra el archivo "ssl-setup.js" que se encuentra en el directorio "connections".

reemplace las rutas hacia los archivos privkey.pem, cert.pem, chain.pem, la ruta que viene por defecto es la usada en sistemas con Ubuntu Server.

4.3 Agregar el ID y Clave Secreta para nuestro cliente web

Defina un ID y Clave Secreta, estos dos valores deben ser encriptados en Base64 y deben ser agregados en la linea 98 del archivo my-login.js.

Ejemplo: si usted define los siguientes valores "mySuperId", "mySuperSecretKey" como su id y clave respectivamente, podría utilizar el siguiente sitio web  https://www.base64encode.org/ para encriptarlos en Base64. Debe usar el siguiente formato mySuperId:mySuperSecretKey resultando la siguiente cadena bXlTdXBlcklkOm15U3VwZXJTZWNyZXRLZXk= 

Una vez la tenga reemplace la linea 98 del archivo my-login.js, debiendo quedar la cadena similar a esto 'Bearer bXlTdXBlcklkOm15U3VwZXJTZWNyZXRLZXk='.

5) Agregar los datos iniciales a su base de datos MongoDB

Ejecute el script de base de datos inicial

node example-data-mongo.js

Una vez terminado de ejecutar, se mostrarán en la terminal los documentos recién agregados a la base de datos, luego de este pasó tendrá un proyecto que pude ser arrancado y visualizado desde un navegador web

6) Ejecuta el servidor Web

npm start


## Ejecutando las pruebas ⚙️

_Explica como ejecutar las pruebas automatizadas para este sistema_

Agregar variable de entorno 
export ENVIROMENT=IN_NETWORK
export ENVIROMENT=IREMOTE
export ENVIROMENT=IPRODUCTION

http://localhost:8080/

npm run build

npm start

### Analice las pruebas end-to-end 🔩

_Explica que verifican estas pruebas y por qué_

```
Da un ejemplo
```

### Y las pruebas de estilo de codificación ⌨️

_Explica que verifican estas pruebas y por qué_

```
Da un ejemplo
```

## Despliegue 📦

_Agrega notas adicionales sobre como hacer deploy_

## Construido con 🛠️

_Menciona las herramientas que utilizaste para crear tu proyecto_

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - El framework web usado
* [Maven](https://maven.apache.org/) - Manejador de dependencias
* [ROME](https://rometools.github.io/rome/) - Usado para generar RSS

## Contribuyendo 🖇️

Por favor lee el [CONTRIBUTING.md](https://gist.github.com/villanuevand/xxxxxx) para detalles de nuestro código de conducta, y el proceso para enviarnos pull requests.

## Wiki 📖

Puedes encontrar mucho más de cómo utilizar este proyecto en nuestra [Wiki](https://github.com/tu/proyecto/wiki)

## Versionado 📌

Usamos [SemVer](http://semver.org/) para el versionado. Para todas las versiones disponibles, mira los [tags en este repositorio](https://github.com/tu/proyecto/tags).

## Autores ✒️

_Menciona a todos aquellos que ayudaron a levantar el proyecto desde sus inicios_

* **Andrés Villanueva** - *Trabajo Inicial* - [villanuevand](https://github.com/villanuevand)
* **Fulanito Detal** - *Documentación* - [fulanitodetal](#fulanito-de-tal)

También puedes mirar la lista de todos los [contribuyentes](https://github.com/your/project/contributors) quíenes han participado en este proyecto. 

## Licencia 📄

Este proyecto está bajo la Licencia (Tu Licencia) - mira el archivo [LICENSE.md](LICENSE.md) para detalles

## Expresiones de Gratitud 🎁

* Comenta a otros sobre este proyecto 📢
* Invita una cerveza 🍺 o un café ☕ a alguien del equipo. 
* Da las gracias públicamente 🤓.
* etc.



---
⌨️ con ❤️ por [Villanuevand](https://github.com/Villanuevand) 😊