# 🌧️ Visor Hidro-Meteorológico

**Visor Hidro-Meteorológico** es una aplicación web desarrollada en Angular 20 que permite visualizar estaciones meteorológicas e hidrológicas georreferenciadas sobre un mapa interactivo, utilizando la biblioteca **OpenLayers**.

Consume una API REST que proporciona información de estaciones, incluyendo ubicación, tipo de sensor, estado de transmisión, categoría y propietario.

---

## 📍 ¿Qué hace esta aplicación?

- Muestra marcadores puntuales en el mapa según `latitud` y `longitud`.
- Visualiza atributos clave como tipo de captor, estado de transmisión, y categoría.
- Permite interacción con los marcadores para obtener más información.
- Utiliza **OpenLayers** como motor GIS para la visualización geográfica.

---

## 🛰️ Ejemplo de objeto recibido por la API REST

```json
{
  "id_estacion": 62526,
  "codigo": "M0124",
  "latitud": "-0.916389",
  "longitud": "-79.245556",
  "altitud": "215.00",
  "id_categoria": 1,
  "categoria": "METEOROLOGICA",
}
````

---

## ⚙️ Tecnologías utilizadas

* [Angular 20](https://angular.dev/)
* [OpenLayers](https://openlayers.org/) (visualización geoespacial)
* SCSS para estilos
* API REST (backend externo, no incluido en este repositorio)

---

## 🚀 Cómo iniciar la aplicación

```bash
ng serve
```

Luego accede a: [http://localhost:4200](http://localhost:4200)

---

## 🧱 Estructura del proyecto

* `src/app/mapa/` → Componente principal del visor
* `src/app/services/` → Servicios para consumir la API
* `src/app/models/` → Interfaces de tipado (`PointObservationModel`, etc.)
* `OpenLayersMapService` → Servicio que encapsula la lógica del mapa

---

## 🧪 Testing

```bash
ng test        # pruebas unitarias
ng e2e         # pruebas end-to-end (si se configuró)
```

---

## 📚 Recursos adicionales

* [Documentación OpenLayers](https://openlayers.org/en/latest/doc/)
* [Documentación Angular CLI](https://angular.dev/tools/cli)
* [Guía de TypeScript](https://www.typescriptlang.org/docs/)

---


## 👤 Autor

**Kevin Changoluisa**
GitHub: [@KevinChangoluisa](https://github.com/KevinChangoluisa)

## 📝 Licencia

Este proyecto está licenciado bajo los términos de la licencia MIT.  
Puedes usarlo, modificarlo y redistribuirlo, **siempre que mantengas la atribución al autor original**:

**Kevin Changoluisa** – [github.com/KevinChangoluisa](https://github.com/KevinChangoluisa)
