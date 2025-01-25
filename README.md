# Campamentos de la Tropa San Luis

Este proyecto busca crear una **experiencia interactiva** que ilustre la historia de los campamentos de la Tropa San Luis a lo largo del tiempo. Utiliza tecnologías modernas de desarrollo web para **combinar** una línea de tiempo animada y un **mapa** que muestra las ubicaciones de los distintos campamentos a través de los años.

---

## 1. **Objetivo General**

El objetivo es **documentar y presentar** la trayectoria de los campamentos realizados por la Tropa San Luis, de modo que cualquiera pueda explorar:
- **Fechas** y lugares de cada campamento.
- **Anecdotario** o hechos relevantes que los marcaron.
- **Ubicaciones geográficas** precisas, reflejadas en un mapa dinámico.

Se busca que esta aplicación sea una **ventana al pasado** y una **fuente de inspiración** para nuevas generaciones de scouts, fomentando la **memoria histórica** de la tropa y su legado.

---

## 2. **Descripción de la Aplicación**

La aplicación se centra en dos elementos principales:

1. **Línea de Tiempo (Timeline)**:  
   - Muestra cada campamento en orden cronológico.  
   - Cuando el usuario hace scroll, se activa la sección correspondiente de la línea de tiempo.  
   - Al seleccionar un campamento, se despliega información detallada como año, nombre del lugar, fotografías y anécdotas.

2. **Mapa Interactivo**:  
   - Ubica cada campamento en un mapa estilizado (por ejemplo, el mapa de Chile).  
   - Permite destacar la región en la que ocurrió el campamento activo en la línea de tiempo.  
   - Opcionalmente, se pueden mostrar trayectorias o rutas de viaje si corresponde.

---

## 3. **Características Principales**

- **Diseño Responsivo**:  
  La aplicación está pensada para funcionar tanto en pantallas de escritorio como en dispositivos móviles, ajustando la línea de tiempo y el mapa de manera dinámica.

- **Animaciones y Transiciones**:  
  Se implementan efectos de transición fluidos para que la navegación por la línea de tiempo y el mapa sea agradable y atractiva, evitando saturar la experiencia de usuario.

- **Información Adicional**:  
  Cada campamento puede incluir detalles como:  
  - **Fotos históricas**.  
  - **Crónicas** o anécdotas.  
  - **Fuentes de información** y enlaces externos para profundizar.

- **Facilidad de Mantenimiento**:  
  Los datos se separan en archivos (por ejemplo, `campamentos.json`), permitiendo actualizarlos sin afectar la estructura de la aplicación.  
  Además, la base del proyecto en Svelte facilita la escalabilidad.

---

## 4. **Público Objetivo**

1. **Miembros de la Tropa San Luis**:  
   Que deseen recordar o conocer la historia de los campamentos pasados.

2. **Comunidad Scout**:  
   Interesados en descubrir las actividades, metodologías y anécdotas que surgen de cada campamento.

3. **Historiadores y Entusiastas**:  
   Personas que quieran recopilar datos sobre la evolución de grupos de exploración y su contexto cultural.

---

## 5. **Alcance y Futuras Extensiones**

1. **Agregar Más Datos**:  
   - Incluir testimonios orales, videos o audio-relatos.  
   - Ampliar el contenido con documentos históricos digitalizados.

2. **Gestor de Contenidos (Backend)**:  
   - Implementar una base de datos para almacenar y gestionar la información de forma colaborativa.  
   - Crear paneles de administración para que los líderes scouts o encargados puedan subir datos de nuevos campamentos.

3. **Integración de Redes Sociales**:  
   - Permitir que los usuarios compartan instantáneas históricas o anécdotas en sus redes sociales.  
   - Añadir comentarios o foros de discusión.

---

## 6. **Tecnologías Propuestas**

- **Svelte**: Manejo de la interfaz de usuario de forma reactiva y eficiente.  
- **D3.js**: Renderizado y manipulación de elementos gráficos (mapas, diagramas).  
- **Scrollama.js**: Sincronización de eventos según el desplazamiento vertical (scroll).  
- **(Opcional) Backend**: Node.js, Flask o cualquier framework que permita proveer datos dinámicos o autenticación si se requiere en el futuro.  
- **Hosting**: Servicios como Vercel o Netlify para un despliegue ágil y sin complicaciones.

---

## 7. **Cómo Usar la Aplicación**

El **flujo de navegación** básico es el siguiente:

1. **Página de Inicio**: Presenta una introducción al proyecto y la línea de tiempo que se puede comenzar a recorrer.  
2. **Scroll para Avanzar**: A medida que el usuario hace scroll, se activan distintos campamentos en la línea de tiempo, resaltando la sección y mostrando detalles.  
3. **Mapa Interactivo**: Cuando un campamento se activa, el mapa se centra en la ubicación correspondiente, mostrando un marcador y/o resaltando la región en color.  
4. **Explorar Detalles**: El usuario puede hacer clic en la tarjeta del campamento para ver más información: fotos, anécdotas, datos curiosos, etc.

---

## 8. **Contribución**

Si deseas **colaborar con el proyecto**, ya sea añadiendo más datos históricos, optimizando el código o traduciendo la aplicación a otros idiomas:

1. **Revisar la Estructura de Archivos**: Ver cómo se organizan los componentes y los datos en la carpeta `src/` y `data/`.  
2. **Seguir las Convenciones de Documentación**: Incluir comentarios claros para cada nueva función o componente.  
3. **Proponer Mejoras**: Cualquier idea para mejorar la interactividad o la presentación es bienvenida.

---

## 9. **Licencia**

El contenido histórico, fotografías y anécdotas puede estar sujeto a **derechos de autor** pertenecientes a la Tropa San Luis y sus miembros. El código de la aplicación puede licenciarse bajo términos abiertos (por ejemplo, [MIT License](https://opensource.org/licenses/MIT)) para fomentar su uso y adaptación en otros proyectos educativos o scouts.

---

## 10. **Contacto**

- **Desarrolladores**: Para temas técnicos (Svelte, D3, scroll interacciones).
- **Líderes Scout Tropa San Luis**: Para información histórica o validación de datos.
- **Comunidad**: Para sugerencias o contribuciones generales.

¡Gracias por tu interés en este proyecto! Tu participación y retroalimentación ayudan a **preservar** y **compartir** la rica historia de la Tropa San Luis.