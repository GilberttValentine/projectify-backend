
# Projectify

Projectify es una aplicación web simple para la agencia de publicidad AdsFoorGood, con el fin de gestionar y supervisar el estado de sus proyectos

La aplicación está construida con el stack de programación MEAN (Mongo, Express, Angular, Node), donde tanto el frontend como el backend se encuentran alojados en servidores distintos (Heroku)


# Testing

Si quieres correr los test, necesitaras usar el siguiente comando `npm run test` y obtendrás la siguiente respuesta:

!["Referemce"](./screenshots/1.png)

Por otro lado, si lo que desea ver es el Test Coverage, necesitaras el siguiente comando `npm run coverage`

!["Referemce"](./screenshots/2.png)

# Api

La aplicación está alojada en diferentes servidores, es decir, el frontend está alojado en un servidor de heroku, el backend igual y la base de datos en Mongodb Atlas

!["Referemce"](./screenshots/3.png)

La api está constituida por 13 endpoints, de los cuales 11 cuentan con un SecurityMiddleware, en los cuales se requiere el siguiente formato

```JSON
Authorization: Bearer <valid token>
```

!["Referemce"](./screenshots/5.png)

## Endpoints

A continuación se describirán los endpoints de la api, la uri por defecto de este es:
```JSON
https://projectifybackend.herokuapp.com/api
```

### Users
- **Create user**<br>
Crea un usuario en el sistema<br>

PATH   |  /users   |
---    | --- | 
METHOD |  POST   |

``` JSON
{
    "names": "Pablo Andrés",
    "lastNames": "Guzman Ríos",
    "email": "pabloguzman@hotmail.com",
    "password": "123456"
}
```

### Projects
- **Create project** | ✓ Authorization required

Crea un proyecto en el sistema
PATH   |  /projects   |
---    | --- | 
METHOD |  POST   |

``` JSON
{
    "name": "Project 1",
    "description": "Project description"
}
```
- **Find all projects**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| ✓ Authorization required
Busca todos los proyectos de un proyecto

PATH   |  /projects   |
---    | --- | 
METHOD |  GET   |

- **Find project by id**&nbsp;&nbsp;&nbsp;&nbsp;| ✓ Authorization required
Busca un proyecto por su id

PATH   |  /projects/:id   |
---    | --- | 
METHOD |  GET   |

- **Activate project**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| ✓ Authorization required

Activa un proyecto

PATH   |  /projects/:id/activate   |
---    | --- | 
METHOD |  PATCH   |

- **Deactivate project** | ✓ Authorization required

Desactiva un proyecto

PATH   |  /projects/:id/deactivate   |
---    | --- | 
METHOD |  PATCH   |

- **Find project reports** | ✓ Authorization required
Muestra todos los reportes realizados a un proyecto en especifico

PATH   |  /projects/:id/reports   |
---    | --- | 
METHOD |  GET   |

### Reports
- **Create report**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| ✓ Authorization required
Crea un reporte de dedicación a un proyecto

PATH   |  /reports   |
---    | --- | 
METHOD |  POST   |

``` JSON
{
    "projectId": "62814e7b9e2e90c9febb1738",
    "dedication": {
        "hours": 5,
        "minutes": 5
    }
}
```

- **Update report**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| ✓ Authorization required
Actualiza las horas de dedicación de un proyecto

PATH   |  /reports/:id   |
---    | --- | 
METHOD |  PUT   |

``` JSON
{
    "dedication": {
        "hours": 10,
        "minutes": 1
    }
}
```

- **Find user reports** | ✓ Authorization required
Busca los reportes de un usuario

PATH   |  /reports/my-reports   |
---    | --- | 
METHOD |  GET   |


- **Find report by id**&nbsp;&nbsp;| ✓ Authorization required
Busca un reporte por su id

PATH   |  /reports/:id   |
---    | --- | 
METHOD |  GET   |


### Security
- **Login**
Permite autenticarse para poder usar las funciones que brinda el sistema

PATH   |  /security/login   |
---    | --- | 
METHOD |  POST   |

``` JSON
{
    "email": "prueba@hotmail.com",
    "password": "123456"
}
```

- **Validate token**
Valida el token de un usuario

PATH   |  /security/verify-token   |
---    | --- | 
METHOD |  POST   |

``` JSON
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lcyI6IlBhYmxvIEFuZHLDqXMiLCJsYXN0TmFtZXMiOiJHdXptYW4gUsOtb3MiLCJlbWFpbCI6InBhYmxvZ3V6bWFuQGhvdG1haWwuY29tIiwic3RhdHVzIjp0cnVlLCJpYXQiOjE2NTI3MDEyNDYsImV4cCI6MTY1MjcwMTg0Nn0.E3PTvqVY4p5LvFtdZPk6KaerR-Gb9TzbV7_f4LN_pTs"
}
```

# Ejecución

Para correr el sistema de manera local, se necesitan las siguiente environments para su correcto funcionamiento:

!["Referemce"](./screenshots/4.png)

```JSON
MONGODB_URI=mongodb://localhost/projectify
MONGODB_TEST_URI=mongodb://localhost/projectify-test
SALT_ROUNDS=10

# JWT
SECRET=petrotuber
EXPIRATION=1d
```

Luego de haber configurado las environments, solo queda por ejecutar el siguiente comando:
``` JSON
npm run dev
```
