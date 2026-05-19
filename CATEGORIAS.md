# Organización de Categorías - Nido Informativo de Migrantes CDMX

## Descripción General

Se ha creado un sistema de organización de datos por categorías para facilitar la identificación, lectura y navegación de la información disponible en el mapa interactivo.

## Categorías Principales

### 1. 🏠 Albergues y Refugios
- **ID**: `shelters`
- **Descripción**: Espacios seguros para hospedaje y protección de migrantes
- **Dataset**: ALBERGUES_final.csv
- **Campos principales**:
  - Nombre
  - Dirección
  - Colonia
  - Alcaldía
  - Teléfono
  - Ubicación (Latitud/Longitud)
- **Cantidad**: 50+ albergues
- **Color en mapa**: Azul (#005CFF)

### 2. 🍽️ Comedores Comunitarios
- **ID**: `kitchens`
- **Descripción**: Espacios de alimentación para la comunidad migrante
- **Dataset**: COMEDORES_FINAL.csv
- **Subcategorías**:
  - **Comedores Comunitarios** (color morado)
  - **Comedores Populares** (color rosa)
  - **Comedores Públicos** (color verde claro)
- **Campos principales**:
  - ID único
  - Nombre
  - Tipo (Comunitario/Popular/Público)
  - Dirección
  - Colonia
  - Horario de atención
  - Alcaldía
- **Cantidad**: 700+ comedores
- **Color en mapa**: Azul claro (#1E96BE)

### 3. ⚖️ Acompañamiento Jurídico
- **ID**: `legal`
- **Descripción**: Asesoría y acompañamiento legal gratuito
- **Dataset**: ACOMPANAMIENTO JURIDICO.csv
- **Campos principales**:
  - Nombre de institución
  - Dirección
  - Colonia
  - Alcaldía
  - Teléfono
  - Horario de atención
- **Cantidad**: 6 instituciones
- **Color en mapa**: Naranja (#F8B195)

### 4. 📋 Derechos Humanos
- **ID**: `humanRights`
- **Descripción**: Centros especializados en defensa y promoción de derechos humanos
- **Dataset**: ACOMPANAMIENTO JURIDICO.csv
- **Campos principales**:
  - Nombre
  - Dirección
  - Colonia
  - Alcaldía
  - Teléfono
  - Horario
- **Cantidad**: Múltiples ubicaciones
- **Color en mapa**: Naranja (#FFA500)

### 5. 🆘 Atención Violencia Sexual
- **ID**: `sexualViolence`
- **Descripción**: Centros especializados en atención a víctimas de violencia sexual
- **Dataset**: VIOLENCIA SEXUAL - VIOLENCIA SEXUAL.csv
- **Campos principales**:
  - Nombre
  - Dirección
  - Colonia
  - Alcaldía
  - Teléfono
  - Horario de atención (24/7 en varios casos)
- **Cantidad**: 6 centros
- **Color en mapa**: Verde turquesa (#3EACA8)

### 6. 🏢 Instituciones Públicas
- **ID**: `publicInstitutions`
- **Descripción**: Organismos públicos para trámites y servicios
- **Dataset**: INSTITUCIONES PUBLICAS.csv
- **Subcategorías**:
  - Migración (COMAR, INM)
  - Empleo (STFE)
  - Derechos Humanos (CNDH, CONAPRED, COPRED)
  - Servicios Sociales (SEDEREC, Protección Civil)
- **Campos principales**:
  - Nombre institución
  - Dirección
  - Colonia
  - Alcaldía
  - Horario
- **Cantidad**: 5 instituciones principales
- **Color en mapa**: Verde (#A2D4AB)

## Estructura de Archivos

```
js/
├── map.js                    # Configuración principal del mapa (modificar si es necesario)
├── app.js                    # Lógica de aplicación
├── categories-config.js      # ✨ NUEVO - Configuración centralizada de categorías
├── data-utilities.js         # ✨ NUEVO - Funciones para organizar y presentar datos
└── secrets.js               # Tokens y configuración (no comprometer)
```

## Cómo Usar la Nueva Estructura

### Acceder a una categoría
```javascript
const shelterCategory = getCategoryById('shelters');
console.log(shelterCategory.name); // "Albergues y Refugios"
```

### Obtener todas las categorías ordenadas
```javascript
const allCategories = getOrderedCategories();
allCategories.forEach(cat => {
  console.log(`${cat.icon} ${cat.name}`);
});
```

### Generar resumen de una categoría
```javascript
const summary = generateCategorySummary(comedoresData, kitchensCategory);
console.log(`Total de comedores: ${summary.totalPlaces}`);
console.log(`Por alcaldía:`, summary.byBorough);
console.log(`Por tipo:`, summary.byType);
```

### Buscar lugares cercanos
```javascript
const userLat = 19.4326;
const userLng = -99.1332;
const nearby = findNearbyPlaces(allPlaces, userLat, userLng, 2); // 2 km
nearby.forEach(place => {
  console.log(`${place.Nombre} - ${formatDistance(place.distance)}`);
});
```

### Agrupar por alcaldía
```javascript
const grouped = groupByBorough(comedoresData);
Object.entries(grouped).forEach(([borough, places]) => {
  console.log(`${borough}: ${places.length} lugares`);
});
```

### Exportar datos a CSV
```javascript
exportToCSV(
  comedoresData, 
  'comedores-export.csv',
  ['ID', 'Nombre', 'Tipo', 'Dirección', 'Alcaldía', 'Horario']
);
```

## Mejoras Implementadas

✅ **Centralización**: Toda la configuración de categorías en un único archivo
✅ **Consistencia**: Estructura uniforme para todas las categorías
✅ **Escalabilidad**: Fácil agregar nuevas categorías o campos
✅ **Utilidades**: Funciones reutilizables para operaciones comunes
✅ **Búsqueda**: Funciones para filtrar y buscar lugares
✅ **Exportación**: Capacidad de exportar datos en formato CSV
✅ **Geolocalización**: Cálculo de distancias y lugares cercanos
✅ **Validación**: Herramientas para validar datos (teléfonos, etc.)

## Colores por Alcaldía

Cada alcaldía tiene un color asignado para fácil identificación:
- **Milpa Alta**: Rojo (#FF6B6B)
- **Xochimilco**: Verde turquesa (#4ECDC4)
- **Tláhuac**: Azul claro (#45B7D1)
- **La Magdalena Contreras**: Verde claro (#96CEB4)
- **Tlalpan**: Amarillo claro (#FFEAA7)
- **Y 11 alcaldías más...**

## Próximos Pasos

Para integrar completamente esta estructura:

1. **Actualizar `index.html`**: Incluir los nuevos archivos JS
   ```html
   <script src="./js/categories-config.js"></script>
   <script src="./js/data-utilities.js"></script>
   ```

2. **Crear panel de filtros**: Usar las categorías para crear controles interactivos

3. **Mejorar tooltips**: Usar `formatPlaceCard()` para información más legible

4. **Agregar búsqueda**: Implementar búsqueda con `searchPlaces()`

5. **Geolocalización**: Usar `findNearbyPlaces()` para mostrar lugares cercanos

## Ejemplo: Panel de Información

```html
<div id="info-panel">
  <h2>Categorías de Servicios</h2>
  <ul id="categories-list"></ul>
</div>

<script>
  const list = document.getElementById('categories-list');
  getOrderedCategories().forEach(cat => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${cat.icon} ${cat.name}</span>
      <p>${cat.description}</p>
      <button onclick="showCategory('${cat.id}')">Ver en mapa</button>
    `;
    list.appendChild(li);
  });
</script>
```

## Soporte y Preguntas

Si tienes preguntas sobre la estructura o necesitas agregar más categorías:
- Revisa `categories-config.js` para la configuración
- Consulta `data-utilities.js` para funciones disponibles
- Abre un issue en el repositorio del proyecto

---

**Última actualización**: Mayo 2026
**Versión**: 1.0
