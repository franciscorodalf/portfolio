<h1 align="center">💻 Portfolio Retro · Francisco Yariel</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Hecho%20con-HTML%2C%20CSS%20y%20JS-00FF88?style=for-the-badge&logo=codepen&logoColor=black" alt="stack" />
  <img src="https://img.shields.io/badge/Animaciones-AOS%20%26%20Typed.js-00FF88?style=for-the-badge&logo=javascript&logoColor=black" alt="animaciones" />
  <img src="https://img.shields.io/badge/Correo%20enviable-EmailJS-00FF88?style=for-the-badge&logo=gmail&logoColor=black" alt="emailjs" />
</p>

---

## 🧠 Sobre el proyecto

Este portfolio nace con la idea de reflejar mi progreso como desarrollador de **Aplicaciones Multiplataforma**.  
Quería algo distinto: no una simple web estática, sino una experiencia visual inspirada en una **consola retro** y el ambiente de un **monitor CRT**.  

---

## ⚙️ Tecnologías utilizadas

| Categoría | Herramientas / Librerías |
|------------|--------------------------|
| **Frontend base** | HTML5 · CSS3 · JavaScript |
| **Fuentes** | [Space Mono](https://fonts.google.com/specimen/Space+Mono) · [Inter](https://fonts.google.com/specimen/Inter) |
| **Animaciones** | [AOS](https://michalsnik.github.io/aos/) · [Typed.js](https://github.com/mattboldt/typed.js) |
| **Carruseles y efectos** | Splide.js · CSS keyframes personalizados |
| **Correo automático** | [EmailJS](https://www.emailjs.com/) |
| **Hosting** | GitHub Pages |

---

## 🧩 Funcionalidades principales

### 🔹 1. Boot sequence animada
Una pequeña pantalla de inicio simula la carga de un sistema, mostrando:
```

> initializing...
> loading assets...
> welcome, Fran.

````
Le da identidad al proyecto y marca la experiencia desde el primer segundo.

---

### 🔹 2. Sección de proyectos dinámica (GitHub API)
La sección **proyectos_destacados()** se alimenta directamente de mi cuenta de GitHub:

```js
const response = await fetch(`https://api.github.com/users/${username}/repos`);
````

* Filtra forks y proyectos vacíos.
* Los ordena por prioridad y estrellas.
* Genera tarjetas con descripción, lenguaje y fecha de actualización.

Todo se actualiza automáticamente cada vez que publico algo nuevo.

---

### 🔹 3. Formulario funcional con EmailJS

El formulario **contacto()** envía correos en tiempo real usando la API de EmailJS, sin backend.

* Validación nativa con JavaScript
* Estado tipo consola:

  ```
  > sending message...
  > message sent ✅
  ```
* Auto-respuesta con HTML estilizado acorde al diseño del portfolio.

---

### 🔹 4. Animaciones suaves y diseño responsive

AOS y CSS se combinan para crear un estilo fluido, sin sacrificar rendimiento.
Cada sección entra con un *fade-up* o *zoom-in* ligero, respetando el enfoque minimalista.

---

## 🧱 Estructura del proyecto

```
portfolio/
├── assets/
│   ├── icons/
│   ├── image.png
│   └── favicon.svg
├── css/
│   └── style.css
├── js/
│   └── main.js
├── libs/
│   ├── aos.js
│   ├── typed.min.js
│   ├── splide.min.js
│   └── animate.min.css
└── index.html
```

---

## 🧩 Problemas y soluciones

| Problema                                            | Solución aplicada                                                                                                            |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **EmailJS no se inicializaba**                      | El script se cargaba con `type="module"`, aislando el ámbito global. Se eliminó el atributo y se corrigió el orden de carga. |
| **El correo llegaba con etiquetas `<h2>` visibles** | La plantilla de EmailJS estaba en modo texto plano; se cambió a formato HTML y se rediseñó el cuerpo con estilo CRT.         |
| **GitHub API no mostraba proyectos**                | Se agregaron filtros y `await` en la función `hydrateProjects()` para controlar el estado de carga.                          |
| **Diseño muy pegado a los bordes**                  | Se añadió padding global y contenedor `.container` para espaciar mejor el contenido.                                         |
| **Animaciones bruscas**                             | Ajuste de `AOS duration` y suavizado de transiciones con cubic-bezier.                                                       |

---

## 🌐 Despliegue

El sitio está alojado en **GitHub Pages**, con dominio público:
👉 [https://franciscorodalf.github.io/portfolio/](https://franciscorodalf.github.io/portfolio/)

Pasos principales:

1. Subir todo el proyecto al repositorio.
2. Activar Pages en `Settings → Pages → Deploy from branch`.
3. Seleccionar rama `main` y carpeta `/ (root)`.

---

## 💡 Aprendizaje personal

* Profundicé en **consumo de APIs**, **animaciones JS** y **integración sin backend**.
* Aprendí a depurar asincronía en proyectos estáticos.
* Descubrí que el detalle estético marca la diferencia, incluso en código.
---

## 🧾 Créditos

**Autor:** [Francisco Yariel Rodríguez Alfonso](https://github.com/franciscorodalf)
**Ubicación:** Tenerife, España
**Correo:** [francuban1278@gmail.com](mailto:francuban1278@gmail.com)
**LinkedIn:** [Perfil Profesional](https://www.linkedin.com/in/francisco-yariel-rodriguez-alfonso-1569b1371)

---

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=franciscorodalf&label=Vistas%20al%20perfil&color=00ff88&style=flat" alt="visitas" />
</p>
