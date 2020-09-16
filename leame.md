# smart-home-alexa-and-google

Proyecto para control de dispositivos inteligentes por medio de Google Home y Amazon Alexa. La idea es centralizar el estado e información de los dispositivos de tu hogar en una sola aplicación, de forma que al agregar un dispositivo nuevo este aparezca tanto en Google Home y Amazon Alexa, asi mismo las ordenes y cambios de estado puedan ser enviadas desde ambos asistentes, y que al mismo tiempo cada asistente muestre el estado actualizado del dispositivo independiente de quien envió la orden.

## Comenzando 🚀

Este proyecto es grande, usa una mezacla de muchas tecnologías, aunque he intentado de utilizar el mismo lenguaje (JavaScript) para todo el proyecto, no deja de ser un desafío que toma mucho tiempo de implementar, ha día de hoy calculo que levantar el servidor podría tomar 2 días.

Este repositorio es parte del proyecto que he implementado en mi casa, nunca pensé que me tomaría tanto tiempo llegar a lo que tengo hoy (2 años aprox, ya que solo podía avanzar en mi tiempo libre y a veces pasaban meses sin avanzar). Por esto he realizado una guia de 13 pasos donde detallo cada paso del desarrollo (al ser un proyecto grande esta guia también me sirve para darle soporte a futuro), dejo el siguiente enlace a quien lo necesite.

https://loqueseaqueaprenda.blogspot.com/2020/03/proyecto-demotica-parte-1-arquitectura.html  

Algunas cosas que veremos son:

- Montar Raspberry Pi con Ubuntu Server
- Servidor de autenticación Oauth 2
- Servidor web por medio de NodeJS Express
- Servicio web certificado con SSL mediante Letsencrypt.org
- Frontend en Polymer 3
- Backend en NodeJS
- Persistencia de datos en MongoDB
- Dominios dinámicos (usando Google domain)
- Crear servicio de tercero en Google Actions
- Crear servicio de tercero en Alexa Skills
- Ejecutar llamadas a ESPurna

Actualmente tengo este proyecto corriendo en un máquina Raspberry Pi 2 como servidor, y me ha dado excelentes resultados, su bajo consumo y silencio, hace que el hardware pase muy desapercibido. Adicionalmente estoy usando hardware compatible con ESPURNA para controlar los dispositivos por medio de ordenes en radiofrecuencia 433Mhz, y a futuro tengo pensado programar las órdenes para un control de infrarojos.


### Pre-requisitos 📋

Servidor con sistema operativo compatible con las siguientes versiones de software:

- NodeJs mínimo v10.16.3, recomendado v12.18.3
- NPM mínimo 6.11.3, recomendado 6.14.7
- MongoDB minimo 3.0.14, recomendado 3.6.8

El servidor de producción debe ser accesible desde un dominio público con certificación SSL (puerto 443), en caso contrario no podrá enlazarse desde el Skill de Amazon o el Actions de Google, además el entorno o sistema operativo debe redireccionar las llamadas http hacia los siguientes puertos:

- 80 -> 8080
- 443 -> 8443

Ya que por motivos de seguridad la aplicación no utiliza directamente los puertos 80 y 443.

### Instalación 🔧

#### 1) clonar el proyecto desde Github

Ejecuta el siguiente comando en tu consola

```console
git clone https://github.com/pablotoledom/smart-home-alexa-and-google.git
```

#### 2) Instalar las dependencias en node_modules

Ejecuta los siguientes comandos en tu consola

```console
cd smart-home-alexa-and-google

npm install

npm audit fix

```

#### 3) Agregar los datos de configuración

##### 3.1 Actualizar la cadena de conexión a la base de datos

Abra el archivo "database-setup.js" que se encuentra en el directorio "connections".

reemplace la cadena mongodb://user:password@localhost, por sus datos de conexión según los ambientes que tenga disponibles.

##### 3.2 Actualizar las rutas hacia los certificados SSL

Abra el archivo "ssl-setup.js" que se encuentra en el directorio "connections".

reemplace las rutas hacia los archivos privkey.pem, cert.pem, chain.pem, la ruta que viene por defecto es la usada en sistemas con Ubuntu Server.

##### 3.3 Definir la siguiente variable de entorno según sea el caso

Si va a correr el proyecto en su maquina local sin un certificado SSL, no debe declarar ninguna variable.

```console
export ENVIROMENT=IN_NETWORK  
```
```console
export ENVIROMENT=REMOTE  
```
```console
export ENVIROMENT=PRODUCTION  
```  

##### 3.4 Agregar el ID y Clave Secreta para nuestro cliente web

Defina un ID y Clave Secreta, estos dos valores deben ser encriptados en Base64 y deben ser agregados en la linea 98 del archivo my-login.js.

Ejemplo: si usted define los siguientes valores "mySuperId", "mySuperSecretKey" como su id y clave respectivamente, podría utilizar el siguiente sitio web  https://www.base64encode.org/ para encriptarlos en Base64. Debe usar el siguiente formato mySuperId:mySuperSecretKey resultando la siguiente cadena bXlTdXBlcklkOm15U3VwZXJTZWNyZXRLZXk= 

Una vez la tenga reemplace la linea 98 del archivo my-login.js, debiendo quedar la cadena similar a la que se incluye de ejemplo:  
'Basic bXlTdXBlcklkOm15U3VwZXJTZWNyZXRLZXk='.

#### 4) Agregar los datos iniciales a su base de datos MongoDB

Ejecute el script de base de datos inicial

```console
node ./example-data/example-data-mongo.js
```

Una vez terminado de ejecutar, se mostrarán en la terminal los documentos recién agregados a la base de datos, luego de este paso tendrá un proyecto que pude ser arrancado y visualizado desde un navegador web

#### 5) Ejecuta el servidor Web

```console
npm start
```

## Ejecutando las pruebas ⚙️

El servidor se levanta en el puerto 8080 (sin SSL) y en el puerto 8443 (con SSL), para visulizar el frontend y los servicios acceda desde su navegador web a la IP correspondiente.

Si ha montado el proyecto en un servidor acceda desde la IP del servidor.

Si ha montado el proyecto en su máquina local ingrese a

```
http://localhost:8080/
```

### Utilizar la cuenta de ejemplo

#### Usuario:

```
myUserName
```

#### Contraseña:

```
smarthome
```

Si todo ha salido bien, deberías poder ver la pantalla de login y al iniciar la sesíon se debería ver un dispositivo de prueba.

![alt text](https://1.bp.blogspot.com/-AO_FmG7hNWU/X1vCapafzbI/AAAAAAAA668/iDmELl1AlpQsLFme1nOJVkE81emxpCUEwCLcBGAsYHQ/s1580/Sin%2Bnombre.jpg)

Agrega nuevos dispositivos

## Despliegue 📦

Para continuar con este proyecto se debe crear el servicio de tercero dentro de tu asistente, a continuación dejo los enlaces para el asistente que utilices o si lo deseas para ambos.

### 1) Crear un Actions de Google asistant y enlazar a tu servidor

https://loqueseaqueaprenda.blogspot.com/2020/09/proyecto-domotica-parte-11-crear.html


### 2) Crear un Skill de Amazon Alexa y enlazar a tu servidor  

https://loqueseaqueaprenda.blogspot.com/2020/09/proyecto-domotica-parte-12-crear.html


## Autor

Pablo Toledo


## Licencia 📄

Este proyecto está bajo la Licencia Apache, Versión 2.0 - mira el archivo [LICENCIA.md](LICENSE.md) para detalles.

## Expresiones de Gratitud 🎁

- Agradecimiento a [Pedro Trujillo](https://github.com/pedroetb) por los ejemplos para montar un servidor Oauth 2 con NodeJS y MongoDB
- Agradecimiento a la comunidad de Google Actions por el proyecto web en Polymer 3 sobre Firebase que he usado como base para administrar los dispositivos [Actions On Google](https://github.com/actions-on-google)
- Agradecimiento a la comunidad de Alexa por los ejemplos disponibles [Alexa](https://github.com/alexa/)
- Agradecimiento a [Andrés Villanueva](https://github.com/Villanuevand) por la guía para construir el readme