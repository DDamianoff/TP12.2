# TP 12
Cree una app web que administre el estado académico de un alumno.

Para ello debe crear una base de datos con un API/REST con json-server que tenga el siguiente formato.

```JSON
{
    "materias": [
            {
                "id": 1,
                "nombre": "programacion 2",
                "estadoId": 3,
                "profesorId": 3
            }
        ],
        "estado": [
            {
                "id": 1,
                "descripcion": "aprobada"
            }
        ],
        "profesores": [
            {
                "apeynomb": "Silva Teseira Ricardo",
                "id": 1
            }  
    ]
}
```

La aplicación debe implementar el CRUD de las 3 entidades y con sus respectivas relaciones, además debe validar ingreso de datos vacíos y repetidos.
Nota: use HTML semántico y CSS