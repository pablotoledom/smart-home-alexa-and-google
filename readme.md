# smart-home

Proyecto para control de dispositivos inteligentes por medio de Google Home y Amazon Alexa. La idea es centralizar el estado e información de los dispositivos de tu hogar en una sola aplicación, de forma que al agregar un dispositivo nuevo este aparezca tanto en Google Home y Amazon Alexa, asi mismo las ordenes y cambios de estado puedan ser enviadas desde ambos asistentes, y que al mismo tiempo cada asistente muestre el estado actualizado del dispositivo independiente de quien envió la orden.

## Comenzando 🚀

Este proyecto es grande, usa una mezacla de muchas tecnologías, aunque he intentado de utilizar el mismo lenguaje (JavaScript) para todo el proyecto, no deja de ser un desafío que toma mucho tiempo de implementar, ha día de hoy calculo que levantar el servidor podría tomar 2 días.

Algunas cosas que veremos son:

- Servidor de autenticación Oauth 2
- Servidor web por medio de NodeJS Express
- Servicio web certificado con SSL mediante Letsencrypt.org
- Frontend en Polymer 3
- Backend en NodeJS
- Persistencia de datos en MongoDB

Actualmente tengo este proyecto corriendo en un máquina Raspberry Pi 2 como servidor, y me ha dado excelentes resultados, su bajo consumo y silencio, hace que el hardware pase muy desapercibido. Adicionalmente estoy usando hardware compatible con ESPURNA para controlar los dispositivos por medio de ordenes en radiofrecuencia 433Mhz, y a futuro tengo pensado programar las órdenes para un control de infrarojos.

Mira **Deployment** para conocer como desplegar el proyecto.


### Pre-requisitos 📋

Servidor con sistema operativo compatible con las siguientes versiones de software:

NodeJs mínimo v10.16.3, recomendado v12.18.3
NPM mínimo 6.11.3, recomendado 6.14.7
MongoDB minimo 3.0.14, recomendado 3.6.8

El servidor de producción debe ser accesible desde un dominio público con certificación SSL (puerto 443), si no no podrá ser accedido desde el Skill de Amazon o el Actions de Google.


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

El sitio web se levanta en el puerto 8080, asi que para visulizar el frontend solo debe ir a la siguiente url desde su navegador web:

http://localhost:8080/


## Despliegue 📦


## Autor

Pablo Toledo


## Licencia 📄

Este proyecto está bajo la Licencia (Tu Licencia) - mira el archivo [LICENSE.md](LICENSE.md) para detalles

## Expresiones de Gratitud 🎁

* Comenta a otros sobre este proyecto 📢
* Invita una cerveza 🍺 o un café ☕ a alguien del equipo. 
* Da las gracias públicamente 🤓.
* etc.



---
⌨️ con ❤️ por [Villanuevand](https://github.com/Villanuevand) 😊