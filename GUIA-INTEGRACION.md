# 📑 GUÍA DE INTEGRACIÓN: Sistema de Categorías

## ✨ Lo que se ha creado

Se ha desarrollado un **sistema completo de organización de datos por categorías** que mejora significativamente la identificación, lectura y navegación de información en el proyecto Nido Informativo de Migrantes CDMX.

### Archivos Nuevos

1. **`js/categories-config.js`** ⚙️
   - Configuración centralizada de todas las categorías
   - Define estructura, colores, campos y metadata de cada categoría
   - Funciones auxiliares para acceder a la información
   - **Líneas**: 250+

2. **`js/data-utilities.js`** 🛠️
   - Funciones reutilizables para manipular y presentar datos
   - Búsqueda, filtrado, agrupación de datos
   - Exportación a CSV, cálculo de distancias
   - Validación de datos y enlace con servicios externos
   - **Líneas**: 350+

3. **`CATEGORIAS.md`** 📖
   - Documentación completa del sistema
   - Descripción de cada categoría
   - Ejemplos de uso del código
   - Próximos pasos y mejoras sugeridas

4. **`categorias-view.html`** 🎨
   - Página de ejemplo interactiva
   - Visualización de categorías con tarjetas
   - Estadísticas y leyenda de colores
   - Búsqueda y filtrado en tiempo real
   - Diseño responsivo y moderno

---

## 📊 Estructura de Categorías Creadas

| Icono | Categoría | Subcategorías | Cantidad | Color |
|-------|-----------|---------------|----------|-------|
| 🏠 | Albergues y Refugios | - | 50+ | Azul #005CFF |
| 🍽️ | Comedores Comunitarios | 3 tipos | 700+ | Azul claro #1E96BE |
| ⚖️ | Acompañamiento Jurídico | - | 6 | Naranja #F8B195 |
| 📋 | Derechos Humanos | - | 8 | Naranja claro #FFA500 |
| 🆘 | Violencia Sexual | - | 6 | Turquesa #3EACA8 |
| 🏢 | Instituciones Públicas | 4 tipos | 5 | Verde #A2D4AB |

---

## 🚀 Cómo Integrar

### Paso 1: Incluir los archivos en `index.html`

Agrega estas líneas antes de cerrar el `</body>`:

```html
<!-- Configuración de categorías -->
<script src="./js/categories-config.js"></script>

<!-- Utilidades de datos -->
<script src="./js/data-utilities.js"></script>

<!-- Mapa (archivo existente) -->
<script src="./js/map.js"></script>
```

### Paso 2: Usar las funciones en tu código

Después de que Kepler.gl cargue los datos:

```javascript
// Obtener todas las categorías
const categories = getOrderedCategories();
console.log(categories);

// Acceder a una categoría específica
const kitchens = getCategoryById('kitchens');
console.log(`${kitchens.icon} ${kitchens.name}`);

// Generar estadísticas
const summary = generateCategorySummary(comedoresData, kitchens);
console.log(`Total: ${summary.totalPlaces}`);
```

---

## 💡 Casos de Uso

### Ejemplo 1: Mostrar Categorías en UI

```javascript
const categories = getOrderedCategories();
const menu = document.getElementById('category-menu');

categories.forEach(cat => {
  const link = document.createElement('a');
  link.innerHTML = `${cat.icon} ${cat.name}`;
  link.onclick = () => {
    // Filtrar mapa por esta categoría
    filterMapByDataset(cat.datasetId);
  };
  menu.appendChild(link);
});
```

### Ejemplo 2: Búsqueda Inteligente

```javascript
const userInput = "comedores en Milpa Alta";

// Buscar por nombre
const results1 = searchPlaces(comedoresData, userInput, 'Nombre');

// Buscar por alcaldía
const results2 = searchPlaces(comedoresData, "Milpa Alta", 'Alcaldía');

// Combinar resultados
const combinedResults = [...new Set([...results1, ...results2])];
```

### Ejemplo 3: Lugares Cercanos

```javascript
// Usuario en ubicación (19.48, -99.15)
const nearby = findNearbyPlaces(
  allServices,
  19.48,
  -99.15,
  2  // Radio de 2 km
);

nearby.forEach(place => {
  console.log(`${place.Nombre} - ${formatDistance(place.distance)}`);
});
```

### Ejemplo 4: Exportar Datos Filtrados

```javascript
// Filtrar comedores comunitarios
const community = filterBySubcategory(
  comedoresData,
  'kitchens',
  'community'
);

// Exportar a CSV
exportToCSV(
  community,
  'comedores-comunitarios.csv',
  ['ID', 'Nombre', 'Dirección', 'Colonia', 'Alcaldía', 'Horario']
);
```

---

## 🎨 Personalización

### Cambiar colores de categorías

En `categories-config.js`:

```javascript
CATEGORIES_CONFIG.shelters.color = [255, 100, 100]; // RGB
```

### Agregar nueva categoría

```javascript
CATEGORIES_CONFIG.healthServices = {
  id: 'healthServices',
  name: 'Servicios de Salud',
  description: 'Centros médicos y de atención sanitaria',
  icon: '⚕️',
  color: [200, 50, 50],
  datasetId: 'mi-nuevo-dataset',
  fields: {
    name: 'Nombre',
    address: 'Dirección',
    // ... otros campos
  },
  displayFields: ['Nombre', 'Dirección', 'Teléfono']
};

// Agregar a orden
CATEGORIES_ORDER.push('healthServices');
```

---

## 📱 Vista Previa Interactiva

Abre `categorias-view.html` en tu navegador para:
- Ver las categorías con tarjetas interactivas
- Filtrar por categoría
- Ver estadísticas generales
- Buscar servicios

**Dirección**: `file:///tu-ruta/categorias-view.html`

---

## 🔗 Integraciones Útiles

### Google Maps

```javascript
const place = comedoresData[0];
const url = createGoogleMapsUrl(place);
window.open(url); // Abre en Google Maps
```

### WhatsApp

```javascript
const phone = "5512345678";
const message = "¿Cuál es tu horario?";
const url = createWhatsAppUrl(phone, message);
window.open(url); // Abre WhatsApp
```

---

## ✅ Mejoras Implementadas

✔️ **Separación clara de categorías** - Cada categoría bien definida
✔️ **Códigos de color consistentes** - Fácil identificación visual
✔️ **Subcategorías** - Comedores divididos en tipos
✔️ **Campos configurables** - Fácil de extender
✔️ **Funciones reutilizables** - 15+ utilidades disponibles
✔️ **Búsqueda inteligente** - Por nombre, ubicación, tipo
✔️ **Exportación de datos** - A CSV con filtros
✔️ **Geolocalización** - Cálculo de distancias
✔️ **Validación** - De teléfonos y datos
✔️ **Documentación** - Completa y con ejemplos

---

## 🐛 Solución de Problemas

### Error: "CATEGORIES_CONFIG is not defined"
```javascript
// Asegúrate de que categories-config.js está cargado primero
// Verifica en el orden en index.html
```

### Los datos no se muestran
```javascript
// Verifica que el datasetId coincide con el de Kepler.gl
console.log(CATEGORIES_CONFIG.kitchens.datasetId); // 'hjuiww'
```

### Búsqueda lenta con muchos datos
```javascript
// Usa índices o búsqueda caché
const cached = new Map();
function cachedSearch(query) {
  if (!cached.has(query)) {
    cached.set(query, searchPlaces(allData, query));
  }
  return cached.get(query);
}
```

---

## 📚 Recursos Adicionales

- **Documentación completa**: `CATEGORIAS.md`
- **Ejemplos en vivo**: `categorias-view.html`
- **API de funciones**: Dentro de `data-utilities.js`
- **Configuración detallada**: Dentro de `categories-config.js`

---

## 🤝 Próximas Mejoras

Sugerencias para futuras versiones:

- [ ] Panel de filtros interactivo en el mapa
- [ ] Búsqueda por rango de horarios
- [ ] Filtros por alcaldía con checkbox
- [ ] Visualización de horas pico
- [ ] Integración con calendario
- [ ] Testimonio de usuarios
- [ ] Ratings y reseñas
- [ ] Notificaciones en tiempo real
- [ ] App móvil con React Native
- [ ] Soporte multiidioma

---

## 📞 Soporte

Si tienes preguntas o encuentras problemas:

1. Revisa `CATEGORIAS.md` para documentación
2. Consulta ejemplos en `categorias-view.html`
3. Abre issue en el repositorio del proyecto
4. Contacta al equipo de desarrollo

---

**Versión**: 1.0  
**Fecha de creación**: Mayo 2026  
**Última actualización**: Mayo 2026  
**Mantenedor**: Equipo de Desarrollo - Nido Informativo de Migrantes CDMX

---

¡Listo para usar! 🎉
