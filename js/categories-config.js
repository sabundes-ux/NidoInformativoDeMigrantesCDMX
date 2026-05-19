/**
 * CONFIGURACIÓN DE CATEGORÍAS - Nido Informativo de Migrantes CDMX
 * Organización centralizada de todas las categorías de servicios
 */

const CATEGORIES_CONFIG = {
  // ALBERGUES Y REFUGIOS
  shelters: {
    id: 'shelters',
    name: 'Albergues y Refugios',
    description: 'Espacios seguros para hospedaje y protección',
    icon: '🏠',
    color: [0, 92, 255],
    datasetId: 'z3qmyb',
    fields: {
      name: 'Nombre',
      address: 'Dirección',
      neighborhood: 'Colonia',
      borough: 'Alcaldía',
      phone: 'Teléfono',
      lat: 'Latitud',
      lng: 'Longitud'
    },
    displayFields: ['Nombre', 'Dirección', 'Colonia', 'Alcaldía', 'Teléfono']
  },

  // COMEDORES COMUNITARIOS
  kitchens: {
    id: 'kitchens',
    name: 'Comedores Comunitarios',
    description: 'Espacios de alimentación para la comunidad',
    icon: '🍽️',
    color: [30, 150, 190],
    datasetId: 'hjuiww',
    subcategories: {
      community: {
        id: 'community',
        name: 'Comedor Comunitario',
        color: [143, 47, 191],
        value: 'Comunitario'
      },
      popular: {
        id: 'popular',
        name: 'Comedor Popular',
        color: [192, 108, 132],
        value: 'Popular'
      },
      public: {
        id: 'public',
        name: 'Comedor Público',
        color: [162, 212, 171],
        value: 'Público'
      }
    },
    fields: {
      id: 'ID',
      name: 'Nombre',
      type: 'Tipo',
      address: 'Dirección',
      neighborhood: 'Colonia',
      borough: 'Alcaldía',
      lat: 'Latitud',
      lng: 'Longitud',
      schedule: 'Horario'
    },
    displayFields: ['Nombre', 'Tipo', 'Dirección', 'Colonia', 'Horario', 'Alcaldía']
  },

  // ATENCIÓN JURÍDICA
  legal: {
    id: 'legal',
    name: 'Acompañamiento Jurídico',
    description: 'Asesoría y acompañamiento legal gratuito',
    icon: '⚖️',
    color: [248, 177, 149],
    datasetId: 'oaebc9',
    fields: {
      name: 'Nombre',
      address: 'Dirección',
      neighborhood: 'Colonia',
      borough: 'Alcaldía',
      phone: 'Teléfono',
      schedule: 'Horario',
      lat: 'Latitud',
      lng: 'Longitud'
    },
    displayFields: ['Nombre', 'Dirección', 'Colonia', 'Alcaldía', 'Teléfono']
  },

  // DERECHOS HUMANOS
  humanRights: {
    id: 'humanRights',
    name: 'Derechos Humanos',
    description: 'Centros de defensa y promoción de derechos',
    icon: '📋',
    color: [255, 165, 0],
    datasetId: 'oaebc9',
    fields: {
      name: 'Nombre',
      address: 'Dirección',
      neighborhood: 'Colonia',
      borough: 'Alcaldía',
      phone: 'Teléfono',
      schedule: 'Horario',
      lat: 'Latitud',
      lng: 'Longitud'
    },
    displayFields: ['Nombre', 'Dirección', 'Colonia', 'Alcaldía', 'Teléfono']
  },

  // ATENCIÓN VIOLENCIA SEXUAL
  sexualViolence: {
    id: 'sexualViolence',
    name: 'Atención Violencia Sexual',
    description: 'Centros especializados en atención a víctimas de violencia sexual',
    icon: '🆘',
    color: [62, 172, 168],
    datasetId: '-myqegl',
    fields: {
      name: 'Nombre',
      address: 'Dirección',
      neighborhood: 'Colonia',
      borough: 'Alcaldía',
      phone: 'Teléfono',
      schedule: 'Horario',
      lat: 'Latitud',
      lng: 'Longitud'
    },
    displayFields: ['Nombre', 'Dirección', 'Colonia', 'Alcaldía', 'Teléfono']
  },

  // INSTITUCIONES PÚBLICAS
  publicInstitutions: {
    id: 'publicInstitutions',
    name: 'Instituciones Públicas',
    description: 'Organismos públicos para trámites y servicios',
    icon: '🏢',
    color: [162, 212, 171],
    datasetId: '-qf9vud',
    subcategories: {
      migration: {
        id: 'migration',
        name: 'Migración',
        value: 'migración'
      },
      labor: {
        id: 'labor',
        name: 'Empleo',
        value: 'empleo'
      },
      humanRights: {
        id: 'humanRights',
        name: 'Derechos Humanos',
        value: 'derechos'
      },
      socialServices: {
        id: 'socialServices',
        name: 'Servicios Sociales',
        value: 'social'
      }
    },
    fields: {
      name: 'NOMBRE',
      address: 'DIRECCION',
      neighborhood: 'COLONIA',
      borough: 'ALCALDIA',
      schedule: 'HORARIO',
      lat: 'LATITUD',
      lng: 'LONGITUD'
    },
    displayFields: ['NOMBRE', 'DIRECCION', 'COLONIA', 'ALCALDIA', 'HORARIO']
  }
};

/**
 * Orden de visualización en la interfaz
 */
const CATEGORIES_ORDER = [
  'shelters',
  'kitchens',
  'legal',
  'humanRights',
  'sexualViolence',
  'publicInstitutions'
];

/**
 * Colores para boroughs (alcaldías)
 */
const BOROUGH_COLORS = {
  'Milpa Alta': '#FF6B6B',
  'Xochimilco': '#4ECDC4',
  'Tláhuac': '#45B7D1',
  'La Magdalena Contreras': '#96CEB4',
  'Tlalpan': '#FFEAA7',
  'Álvaro Obregón': '#DDA15E',
  'Coyoacán': '#BC6C25',
  'Benito Juárez': '#8E9AAF',
  'Iztacalco': '#D4A574',
  'Iztapalapa': '#FF8B94',
  'Gustavo A. Madero': '#A8DADC',
  'Miguel Hidalgo': '#457B9D',
  'Cuauhtémoc': '#F1FAEE',
  'Azcapotzalco': '#E63946',
  'Venustiano Carranza': '#A8E6CF',
  'Cuajimalpa de Morelos': '#FFD3B6'
};

/**
 * Horarios de atención comunes
 */
const COMMON_SCHEDULES = {
  '24horas': '24 hrs. al día, 365 días del año',
  'laboralMF': 'Lunes a viernes, 9:00 - 17:00 hrs.',
  'laboralMJ': 'Lunes a jueves, 9:00 - 18:00 hrs. / Viernes 9:00 - 15:00 hrs.',
  'extendida': 'Lunes a viernes, 9:00 - 21:00 hrs.',
  'noEspecificado': 'Sin horario especificado'
};

/**
 * Función auxiliar para obtener categoría por ID
 */
function getCategoryById(categoryId) {
  return CATEGORIES_CONFIG[categoryId];
}

/**
 * Función auxiliar para obtener todas las categorías ordenadas
 */
function getOrderedCategories() {
  return CATEGORIES_ORDER.map(categoryId => ({
    id: categoryId,
    ...CATEGORIES_CONFIG[categoryId]
  }));
}

/**
 * Función auxiliar para filtrar datos por subcategoría
 */
function filterBySubcategory(data, categoryId, subcategoryId) {
  const category = getCategoryById(categoryId);
  if (!category.subcategories || !category.subcategories[subcategoryId]) {
    return data;
  }
  
  const subcategory = category.subcategories[subcategoryId];
  const typeField = category.fields.type;
  
  return data.filter(item => item[typeField] === subcategory.value);
}

/**
 * Exportar configuración
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CATEGORIES_CONFIG,
    CATEGORIES_ORDER,
    BOROUGH_COLORS,
    COMMON_SCHEDULES,
    getCategoryById,
    getOrderedCategories,
    filterBySubcategory
  };
}
