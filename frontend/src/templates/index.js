/**
 * TEMPLATE REGISTRY - Sistema de Templates Multi-Campaña
 * ======================================================
 * 
 * Este archivo es el registro central de todos los templates de landing disponibles.
 * 
 * CÓMO FUNCIONA:
 * 1. Cada campaña en la BD tiene un campo `template_key`
 * 2. DynamicLandingPage usa este archivo para mapear template_key → componente
 * 3. Si el template_key no existe, se usa el template "cpn" como fallback
 * 4. Cada template define sus "slots" (ubicaciones donde pueden aparecer botones)
 * 
 * CÓMO AGREGAR UN NUEVO TEMPLATE:
 * 1. Crear el componente en /app/frontend/src/templates/Landing[Nombre].jsx
 * 2. Importarlo aquí abajo
 * 3. Agregarlo al objeto TEMPLATE_REGISTRY con su key
 * 4. Definir los slots disponibles en TEMPLATE_SLOTS
 * 5. Actualizar la campaña en Admin con el nuevo template_key
 * 
 * CONVENCIÓN DE NOMBRES:
 * - Archivo: Landing[NombreEnPascalCase].jsx
 * - template_key: nombre-en-kebab-case
 * 
 * TEMPLATES DISPONIBLES:
 * - cpn: Certificación Profesional NeuroCoaching (DEFAULT)
 * - suitex: Suitex - Oficina Digital SaaS
 */

import LandingCPN from './LandingCPN';
import LandingSuitex from './LandingSuitex';

// Registry de templates disponibles
export const TEMPLATE_REGISTRY = {
  // Certificación Profesional NeuroCoaching (DEFAULT)
  'cpn': LandingCPN,
  
  // Suitex - Oficina Digital SaaS
  'suitex': LandingSuitex,
};

// Template por defecto cuando no se encuentra el template_key
export const DEFAULT_TEMPLATE_KEY = 'cpn';

/**
 * SLOTS POR TEMPLATE
 * ==================
 * Define las ubicaciones (slots) donde pueden aparecer botones en cada template.
 * Cada slot tiene:
 * - key: identificador único (usado en display_slots de cada acción)
 * - label: nombre legible para el admin
 * - description: descripción de dónde aparece
 */
export const TEMPLATE_SLOTS = {
  'cpn': [
    { 
      key: 'hero_primary', 
      label: 'Hero - Botón Principal',
      description: 'Botón grande y destacado en la sección principal (Hero)'
    },
    { 
      key: 'hero_secondary', 
      label: 'Hero - Botones Secundarios',
      description: 'Botones más pequeños debajo del botón principal'
    },
    { 
      key: 'cta', 
      label: 'CTA Final',
      description: 'Sección de llamada a la acción al final de la página'
    },
    { 
      key: 'footer', 
      label: 'Footer',
      description: 'Botones en el pie de página'
    }
  ],
  'suitex': [
    { 
      key: 'hero_primary', 
      label: 'Hero - Botón Principal',
      description: 'Botón de Demo/Acción principal en el Hero'
    },
    { 
      key: 'hero_secondary', 
      label: 'Hero - Botones Secundarios',
      description: 'Botones adicionales en el Hero (ej: WhatsApp)'
    },
    { 
      key: 'cta', 
      label: 'CTA Final',
      description: 'Botón principal en la sección final de conversión'
    },
    { 
      key: 'pricing', 
      label: 'Pricing',
      description: 'Botones en la sección de precios'
    }
  ]
};

// Función helper para obtener el template
export const getTemplate = (templateKey) => {
  const template = TEMPLATE_REGISTRY[templateKey];
  
  if (!template) {
    console.warn(
      `[TEMPLATE_REGISTRY] Template "${templateKey}" no encontrado. ` +
      `Usando template por defecto "${DEFAULT_TEMPLATE_KEY}". ` +
      `Templates disponibles: ${Object.keys(TEMPLATE_REGISTRY).join(', ')}`
    );
    return TEMPLATE_REGISTRY[DEFAULT_TEMPLATE_KEY];
  }
  
  return template;
};

// Lista de templates disponibles (útil para Admin UI)
export const getAvailableTemplates = () => {
  return Object.keys(TEMPLATE_REGISTRY).map(key => ({
    key,
    name: key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ')
  }));
};

// Obtener slots disponibles para un template
export const getSlotsForTemplate = (templateKey) => {
  return TEMPLATE_SLOTS[templateKey] || TEMPLATE_SLOTS[DEFAULT_TEMPLATE_KEY] || [];
};

// Obtener descripción de un slot
export const getSlotDescription = (templateKey, slotKey) => {
  const slots = getSlotsForTemplate(templateKey);
  const slot = slots.find(s => s.key === slotKey);
  return slot ? slot.description : slotKey;
};

export default TEMPLATE_REGISTRY;
