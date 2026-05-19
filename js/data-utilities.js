/**
 * UTILIDADES DE PRESENTACIÓN DE DATOS
 * Funciones para formatear y organizar información por categorías
 */

/**
 * Formatea información de un lugar en tarjeta legible
 */
function formatPlaceCard(place, category) {
  const displayFields = category.displayFields;
  const fields = category.fields;
  
  return {
    title: place[fields.name] || 'Sin nombre',
    items: displayFields
      .filter(fieldName => place[fieldName])
      .map(fieldName => ({
        label: fieldName,
        value: place[fieldName],
        icon: getFieldIcon(fieldName)
      }))
  };
}

/**
 * Obtiene icono según el tipo de campo
 */
function getFieldIcon(fieldName) {
  const fieldLower = fieldName.toLowerCase();
  
  const icons = {
    dirección: '📍',
    address: '📍',
    colonia: '🏘️',
    neighborhood: '🏘️',
    alcaldía: '🏛️',
    borough: '🏛️',
    teléfono: '☎️',
    phone: '☎️',
    horario: '🕐',
    schedule: '🕐',
    tipo: '📂',
    type: '📂',
    nombre: '📋',
    name: '📋'
  };
  
  for (let [key, icon] of Object.entries(icons)) {
    if (fieldLower.includes(key)) return icon;
  }
  return '📄';
}

/**
 * Agrupa lugares por alcaldía
 */
function groupByBorough(places, boroughField = 'Alcaldía') {
  return places.reduce((grouped, place) => {
    const borough = place[boroughField] || 'Sin alcaldía';
    if (!grouped[borough]) {
      grouped[borough] = [];
    }
    grouped[borough].push(place);
    return grouped;
  }, {});
}

/**
 * Agrupa lugares por tipo/subcategoría
 */
function groupByType(places, typeField = 'Tipo') {
  return places.reduce((grouped, place) => {
    const type = place[typeField] || 'Otro';
    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type].push(place);
    return grouped;
  }, {});
}

/**
 * Genera resumen estadístico de una categoría
 */
function generateCategorySummary(places, category) {
  const summary = {
    category: category.name,
    totalPlaces: places.length,
    byBorough: {},
    byType: {},
    schedule: {}
  };
  
  // Contar por alcaldía
  const boroughField = category.fields.borough;
  const boroughGrouped = groupByBorough(places, boroughField);
  Object.entries(boroughGrouped).forEach(([borough, items]) => {
    summary.byBorough[borough] = items.length;
  });
  
  // Contar por tipo si aplica
  if (category.fields.type) {
    const typeGrouped = groupByType(places, category.fields.type);
    Object.entries(typeGrouped).forEach(([type, items]) => {
      summary.byType[type] = items.length;
    });
  }
  
  // Contar por horario si aplica
  if (category.fields.schedule) {
    const scheduleField = category.fields.schedule;
    places.forEach(place => {
      const schedule = place[scheduleField] || 'Sin especificar';
      summary.schedule[schedule] = (summary.schedule[schedule] || 0) + 1;
    });
  }
  
  return summary;
}

/**
 * Crea tabla HTML para mostrar datos
 */
function createDataTable(places, fields) {
  let html = '<table class="data-table">';
  
  // Header
  html += '<thead><tr>';
  fields.forEach(field => {
    html += `<th>${field}</th>`;
  });
  html += '</tr></thead>';
  
  // Body
  html += '<tbody>';
  places.forEach(place => {
    html += '<tr>';
    fields.forEach(field => {
      const value = place[field] || '-';
      html += `<td>${escapeHtml(value)}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  
  return html;
}

/**
 * Escapa caracteres HTML para seguridad
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

/**
 * Busca lugares por nombre o campo específico
 */
function searchPlaces(places, query, searchField = 'Nombre') {
  const queryLower = query.toLowerCase().trim();
  
  return places.filter(place => {
    const fieldValue = place[searchField] || '';
    return fieldValue.toLowerCase().includes(queryLower);
  });
}

/**
 * Filtra lugares por rango de coordenadas (para búsqueda por zona)
 */
function filterByBounds(places, bounds, latField = 'Latitud', lngField = 'Longitud') {
  const { north, south, east, west } = bounds;
  
  return places.filter(place => {
    const lat = parseFloat(place[latField]);
    const lng = parseFloat(place[lngField]);
    
    return lat >= south && lat <= north && 
           lng >= west && lng <= east;
  });
}

/**
 * Exporta datos a CSV
 */
function exportToCSV(data, filename = 'export.csv', fields = null) {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }
  
  // Si no se especifican campos, usa todos los disponibles
  const keys = fields || Object.keys(data[0]);
  
  // Crear header
  let csv = keys.map(k => `"${k}"`).join(',') + '\n';
  
  // Agregar datos
  data.forEach(row => {
    csv += keys.map(key => {
      let value = row[key] || '';
      value = String(value).replace(/"/g, '""'); // Escapar comillas
      return `"${value}"`;
    }).join(',') + '\n';
  });
  
  // Descargar
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

/**
 * Calcula distancia entre dos puntos (Fórmula de Haversine)
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Encuentra lugares cercanos a una ubicación
 */
function findNearbyPlaces(places, userLat, userLng, radiusKm = 5, latField = 'Latitud', lngField = 'Longitud') {
  const nearby = places
    .map(place => ({
      ...place,
      distance: calculateDistance(
        userLat, userLng,
        parseFloat(place[latField]),
        parseFloat(place[lngField])
      )
    }))
    .filter(place => place.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
  
  return nearby;
}

/**
 * Formatea distancia para mostrar
 */
function formatDistance(distanceKm) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} metros`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Crea URL de Google Maps para una dirección
 */
function createGoogleMapsUrl(place, addressField = 'Dirección', neighborhoodField = 'Colonia', boroughField = 'Alcaldía') {
  const address = place[addressField] || '';
  const neighborhood = place[neighborhoodField] || '';
  const borough = place[boroughField] || '';
  const fullAddress = `${address}, ${neighborhood}, ${borough}, CDMX`;
  const encoded = encodeURIComponent(fullAddress);
  return `https://www.google.com/maps/search/${encoded}`;
}

/**
 * Crea URL de WhatsApp para contactar
 */
function createWhatsAppUrl(phone, message = '') {
  const cleanPhone = phone.replace(/\D/g, '');
  const messageEncoded = encodeURIComponent(message);
  return `https://wa.me/52${cleanPhone}?text=${messageEncoded}`;
}

/**
 * Validar teléfono mexicano
 */
function isValidMexicanPhone(phone) {
  const phoneRegex = /^(\+?52)?[\s]?(\d{2,3})?[\s]?(\d{4}[\s]?\d{4}|\d{8})$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

/**
 * Exportar todas las utilidades
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatPlaceCard,
    getFieldIcon,
    groupByBorough,
    groupByType,
    generateCategorySummary,
    createDataTable,
    escapeHtml,
    searchPlaces,
    filterByBounds,
    exportToCSV,
    calculateDistance,
    findNearbyPlaces,
    formatDistance,
    createGoogleMapsUrl,
    createWhatsAppUrl,
    isValidMexicanPhone
  };
}
