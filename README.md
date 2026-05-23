# 🌸 ASCII Art Portfolio · Francisco Yariel

<p align="center">
  <img src="https://img.shields.io/badge/Desarrollo-DAM%20%2F%20Full%20Stack%20%26%20Mobile-0B1F3A?style=for-the-badge" alt="Rol" />
  <img src="https://img.shields.io/badge/Est%C3%A9tica-ASCII%20Art%20Procedimental-Moss?style=for-the-badge" alt="Estilo" />
  <img src="https://img.shields.io/badge/Erasmus-Polonia%20%F0%9F%87%B5%F0%9F%87%B1%20(Bowwe)-C67484?style=for-the-badge" alt="Erasmus" />
</p>

Un portfolio web minimalista e interactivo diseñado bajo un concepto estético **Zen / Wabi-sabi**, combinando arte ASCII generado procedimentalmente en tiempo real con mejores prácticas modernas de rendimiento y accesibilidad web.

👉 **Visita mi Portfolio en producción:** [https://franciscorodalf.github.io/portfolio/](https://franciscorodalf.github.io/portfolio/)

---

## 👨‍💻 Sobre Mí

Soy **Francisco Yariel Rodríguez Alfonso**, desarrollador multiplataforma y móvil en formación con base en redes, telecomunicaciones y soporte de sistemas. 

*   🎓 **Estudiante de 2º de DAM (Tenerife, España)**: Con foco en Java, bases de datos SQL y desarrollo de interfaces adaptadas.
*   🌍 **Experiencia Internacional (Erasmus en Bowwe, Polonia - 2025)**: Trabajé diseñando y automatizando embudos de conversión web, flujos de integración y soporte técnico full-stack.
*   💡 **Mi Filosofía:** Unir la rigurosidad técnica de la arquitectura de software con interfaces cuidadas y experiencias de usuario agradables.

---

## 🛠️ Detalles de Ingeniería y Rendimiento

El portfolio no utiliza frameworks pesados para su visualización base, garantizando tiempos de carga ínfimos. Destacan las siguientes soluciones técnicas:

### ⚡ 1. Render Loop Optimizado con `IntersectionObserver`
Los lienzos dinámicos de arte ASCII (el jardín y las olas) se calculan mediante algoritmos procedimentales en JavaScript y actualizan el DOM de forma constante.
*   **Optimización aplicada:** Implementamos un observador de intersección que monitoriza la visibilidad de los lienzos. **Las animaciones se detienen por completo cuando no están en el área visible de la pantalla** (por ejemplo, mientras lees el Hero o el formulario de contacto).
*   **Resultado:** Consumo de CPU reducido a cero en segundo plano y mayor ahorro de batería en dispositivos móviles.

### ✉️ 2. Formulario de Contacto Asíncrono (EmailJS)
Integramos de forma asíncrona la API de **EmailJS** en segundo plano.
*   **UX Mejorada:** Eliminamos el molesto redireccionamiento a clientes de correo nativos (`mailto:`). El botón cambia su estado a `"Enviando..."` y bloquea múltiples envíos, mientras que una nota inferior de estado notifica al usuario si el mensaje fue transmitido con éxito.

### 👁️ 3. Transición de Temas de Alta Calidad
*   El portfolio integra el soporte nativo del tema claro/oscuro del sistema, junto con un control manual.
*   Utiliza la API moderna `document.startViewTransition` en navegadores compatibles para realizar un fundido cruzado fluido entre las paletas cromáticas "Zen" (claro estilo papel antiguo, oscuro estilo bosque profundo).

---

## 📁 Estructura de Proyectos y Casos de Estudio

El portfolio presenta una selección de proyectos estructurados en elementos semánticos `<article>` con accesos directos tanto al código como a su demostración interactiva:

*   **Hermnet (Proyecto Estrella) [E2EE Messaging]**: Aplicación móvil de mensajería instantánea descentralizada y segura con servidor ciego (Zero-Knowledge).
    *   *Stack:* React Native, Expo, TypeScript, Spring Boot (Java), PostgreSQL, Odoo 17, SQLite local.
    *   *Demo y Código:* El portfolio incorpora un modal interactivo con un flujo criptográfico explicativo en arte ASCII.
    *   🔗 [Web Oficial de Hermnet](https://hermnet.github.io/Hermnet-Web/) · [Repositorio GitHub](https://github.com/Hermnet/Hermnet)
*   **Tienda-IA**: Aplicación web orientada a explorar flujos de compra asistidos por Inteligencia Artificial.
    *   *Stack:* TypeScript, React.
    *   🔗 [Demo en Vivo en Vercel](https://tiendawithia.vercel.app)
*   **Really**: App móvil minimalista orientada a detener compras impulsivas mediante un temporizador de "espera obligatoria" y fomentar el ahorro consciente.
    *   *Stack:* React Native, Expo, Firebase Firestore.
*   **SafeInvestor**: Gestor financiero de ingresos, gastos y metas de ahorro.
    *   *Stack:* Java, interfaces de escritorio.
*   **PowerMine**: Reinterpretación de las mecánicas del clásico Buscaminas con habilidades y progresión.
    *   *Stack:* Java, interfaces gráficas.

---

## 🧱 Estructura de Archivos del Repositorio

```text
portfolio/
├── assets/
│   ├── icons/       # Iconos vectoriales de tecnologías
│   └── favicon.svg  # Favicon del sitio
├── old-portfolio/   # Archivo local del portafolio anterior (excluido en Git)
├── index.html       # Estructura del portfolio de arte ASCII y Modales
├── script.js        # Algoritmos de render ASCII, EmailJS e interactividad
├── styles.css       # Diseño Zen y maquetación responsive
└── README.md        # Documentación de ingeniería del portfolio
```

---

## 🧾 Créditos y Contacto

*   **Desarrollador:** Francisco Yariel Rodríguez Alfonso
*   **Ubicación:** Santa Úrsula, Tenerife, España
*   **Email:** [francuban1278@gmail.com](mailto:francuban1278@gmail.com)
*   **LinkedIn:** [linkedin.com/in/francisco-yariel-rodriguez-alfonso-1569b1371](https://www.linkedin.com/in/francisco-yariel-rodriguez-alfonso-1569b1371)
