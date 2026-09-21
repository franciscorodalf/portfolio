# Portfolio · Francisco Yariel Rodríguez Alfonso

<p align="center">
  <img src="https://img.shields.io/badge/Desarrollo-DAM%20%2F%20Multiplataforma%20%26%20M%C3%B3vil-171614?style=for-the-badge" alt="Rol" />
  <img src="https://img.shields.io/badge/Stack-Java%20%C2%B7%20Spring%20Boot%20%C2%B7%20TypeScript%20%C2%B7%20SQL-8C2F24?style=for-the-badge" alt="Stack" />
  <img src="https://img.shields.io/badge/Erasmus-Polonia%20%F0%9F%87%B5%F0%9F%87%B1%20(Bowwe)-55514A?style=for-the-badge" alt="Erasmus" />
</p>

Portfolio personal de una sola página, con estética editorial sobre papel: tipografía serif de gran tamaño, retícula de líneas finas y un campo de puntos animado que reacciona al scroll y al puntero.

👉 **En producción:** [https://franciscorodalf.github.io/portfolio/](https://franciscorodalf.github.io/portfolio/)

---

## 👨‍💻 Sobre mí

Soy **Francisco Yariel Rodríguez Alfonso**, desarrollador multiplataforma y móvil con base en redes, telecomunicaciones y soporte de sistemas.

* 🎓 **2º de DAM (Tenerife, España)** — foco en Java, bases de datos SQL e interfaces adaptadas.
* 🌍 **Erasmus en Bowwe (Polonia, 2025)** — embudos de conversión web, flujos de integración y soporte técnico full-stack en un equipo internacional.
* 💡 **Filosofía** — unir rigor técnico con interfaces cuidadas.

---

## 🛠️ Detalles técnicos

Sitio estático sin frameworks ni proceso de build: se sirve tal cual desde GitHub Pages.

### 🎨 Campo de puntos en `<canvas>`
Una retícula de puntos deformada por funciones de onda, dibujada en un `requestAnimationFrame`. La forma cambia según la sección visible (olas → deriva diagonal → anillos → flujo horizontal → respiración lenta), con interpolación suave entre estados, y los puntos se apartan del cursor.
* Un `IntersectionObserver` detiene el dibujado cuando el lienzo sale de pantalla.
* Un `ResizeObserver` reajusta el búfer al `devicePixelRatio` (limitado a 2×).

### 🌐 Bilingüe ES / EN
Cada nodo traducible lleva su versión inglesa en `data-en`; al inicializar se guarda la española en `data-es` y el botón del header alterna entre ambas, actualizando también el atributo `lang` del documento.

### 📂 Paneles de proyecto
Cada fila de proyecto es un `role="button"` accesible por teclado que despliega su ficha (problema · solución · aprendizaje) animando la altura con la Web Animations API y manteniendo `aria-expanded` sincronizado.

### ✉️ Formulario de contacto
Valida los tres campos en cliente y compone un `mailto:` con asunto y cuerpo ya rellenados. Sin servicios externos ni claves de API.

### ♿ Accesibilidad y movimiento
Todo el movimiento —intro, reveals, parallax, paneles— se desactiva bajo `prefers-reduced-motion: reduce`.

---

## 📁 Proyectos incluidos

* **Hermnet** *(proyecto estrella)* — mensajería instantánea descentralizada con servidor ciego zero-knowledge y cifrado E2EE híbrido (AES-256-GCM + RSA-OAEP-SHA256). Proyecto final de DAM.
  *Stack:* React Native · Expo · TypeScript · Spring Boot · PostgreSQL · Odoo 17 · SQLite
  🔗 [Web oficial](https://hermnet.github.io/Hermnet-Web/) · [Repositorio](https://github.com/Hermnet/Hermnet)
* **Tienda-IA** — flujos de compra e interfaces de tienda asistidos por IA. *TypeScript · React · Vercel.*
  🔗 [Demo](https://tiendawithia.vercel.app) · [Repositorio](https://github.com/franciscorodalf/Tienda-IA)
* **Really** — frena la compra impulsiva con un temporizador de espera obligatoria y lo convierte en ahorro. *React Native · Expo · Firebase.*
  🔗 [Repositorio](https://github.com/franciscorodalf/Really)
* **SafeInvestor** — gestor de ingresos, gastos y metas de ahorro. *Java · SQL.*
  🔗 [Repositorio](https://github.com/franciscorodalf/SafeInvestor)
* **PowerMine** — reinterpretación del Buscaminas con trampas, habilidades y progresión. *Java · GUI.*
  🔗 [Repositorio](https://github.com/franciscorodalf/PowerMine)
* **Pick-A-Ball** — proyecto de juego fuera del stack Java/web. *C# · Unity.*
  🔗 [Repositorio](https://github.com/franciscorodalf/Pick-A-Ball)

---

## 🧱 Estructura del repositorio

```text
portfolio/
├── assets/
│   ├── icons/              # Iconos vectoriales de tecnologías
│   ├── francisco.jpg       # Retrato del hero
│   └── hermnet-logo.png    # Logotipo del proyecto estrella
├── index.html              # Página completa (maquetación con estilos inline)
├── styles.css              # Base tipográfica y estados hover/focus
├── script.js               # Canvas, idioma, paneles, reveals y formulario
└── README.md
```

El favicon va embebido como `data:` URI en el `<head>`, así que no hay fichero de icono.

## ▶️ Desarrollo local

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000`. No hay dependencias que instalar ni paso de compilación.

---

## 🧾 Créditos y contacto

* **Desarrollador:** Francisco Yariel Rodríguez Alfonso
* **Ubicación:** Santa Úrsula, Tenerife, España
* **Email:** [franciscoyarielrodriguezalfons@gmail.com](mailto:franciscoyarielrodriguezalfons@gmail.com)
* **LinkedIn:** [linkedin.com/in/francisco-yariel-rodriguez-alfonso-1569b1371](https://www.linkedin.com/in/francisco-yariel-rodriguez-alfonso-1569b1371)
