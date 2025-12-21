/**
 * TEMPLATE REGISTRY - Sistema de Templates Multi-Campaña
 * ======================================================
 * 
 * ARQUITECTURA OPCIÓN B (DEFINITIVA):
 * - 1 BOTÓN = 1 SLOT (ubicación única y fija)
 * - El admin NO elige dónde aparece el botón
 * - El slot es propiedad del botón, definido por el diseño
 * 
 * FLUJO:
 * TEMPLATE define BOTONES → Cada BOTÓN tiene slot fijo → ACCIÓN configura label/estado → MENTOR pone URL
 * 
 * CÓMO AGREGAR UN NUEVO TEMPLATE:
 * 1. Crear el componente en /app/frontend/src/templates/Landing[Nombre].jsx
 * 2. Importarlo aquí
 * 3. Agregarlo a TEMPLATE_REGISTRY
 * 4. Definir sus SLOTS en TEMPLATE_SLOTS
 * 5. Definir sus BOTONES en TEMPLATE_BUTTONS (1 botón = 1 slot)
 */

import LandingCPN from './LandingCPN';
import LandingSuitex from './LandingSuitex';

// ============================================
// TEMPLATE REGISTRY - Componentes
// ============================================
export const TEMPLATE_REGISTRY = {
  'cpn': LandingCPN,
  'suitex': LandingSuitex,
};

export const DEFAULT_TEMPLATE_KEY = 'cpn';

// ============================================
// SLOTS POR TEMPLATE
// ============================================
// Ubicaciones visuales fijas en cada landing
export const TEMPLATE_SLOTS = {
  'cpn': [
    { key: 'hero_primary', label: 'Hero - Botón Principal', description: 'Botón grande y destacado en la sección principal' },
    { key: 'hero_secondary', label: 'Hero - Botón Secundario', description: 'Botón debajo del principal en el Hero' },
    { key: 'awakening', label: 'Sección Despertar', description: 'Botón en la sección "Es momento de despertar"' },
    { key: 'is_for_you', label: 'Sección ¿Es para ti?', description: 'Botón en la sección de perfil ideal' },
    { key: 'why_inverser', label: 'Sección ¿Por qué InverSer?', description: 'Botón en la sección de beneficios' },
    { key: 'cta', label: 'CTA Final', description: 'Sección de llamada a la acción al final' },
    { key: 'footer', label: 'Footer', description: 'Área de contacto en el pie de página' }
  ],
  'suitex': [
    { key: 'hero_primary', label: 'Hero - Botón Principal', description: 'Botón de Demo/Acción principal en el Hero' },
    { key: 'hero_secondary', label: 'Hero - Botón Secundario', description: 'Botón adicional en el Hero' },
    { key: 'cta', label: 'CTA Final', description: 'Botón en la sección final de conversión' },
    { key: 'pricing', label: 'Pricing', description: 'Botón en la sección de precios' }
  ]
};

// ============================================
// BOTONES POR TEMPLATE - OPCIÓN B
// ============================================
// REGLA: 1 BOTÓN = 1 SLOT ÚNICO Y FIJO
// - key: identificador único del botón
// - label_default: texto visible en la landing
// - slot: ubicación FIJA (solo lectura para el admin)
// - description: explicación para el admin/mentor
// - type: 'external_url' (abre URL) o 'internal' (scroll)
// - style: estilo visual (primary, secondary, outline, link)
export const TEMPLATE_BUTTONS = {
  'cpn': [
    // ===== HERO SECTION =====
    {
      key: 'agenda_hero',
      label_default: 'Agendar Llamada',
      slot: 'hero_primary',
      description: 'Botón principal del Hero para agendar una llamada con el mentor',
      type: 'external_url',
      style: 'primary'
    },
    {
      key: 'whatsapp_hero',
      label_default: 'Hablar por WhatsApp',
      slot: 'hero_secondary',
      description: 'Contacto directo vía WhatsApp en el Hero',
      type: 'external_url',
      style: 'secondary'
    },
    // ===== AWAKENING SECTION =====
    {
      key: 'iniciar_transformacion',
      label_default: 'Quiero Iniciar mi Transformación',
      slot: 'awakening',
      description: 'Botón en la sección "Es momento de despertar"',
      type: 'external_url',
      style: 'primary'
    },
    // ===== IS FOR YOU SECTION =====
    {
      key: 'solicitar_entrevista',
      label_default: 'Solicita tu Entrevista',
      slot: 'is_for_you',
      description: 'Botón en la sección "¿Es para ti?"',
      type: 'external_url',
      style: 'primary'
    },
    // ===== WHY INVERSER SECTION =====
    {
      key: 'solicitar_info',
      label_default: 'Solicita Información',
      slot: 'why_inverser',
      description: 'Botón en la sección "¿Por qué InverSer?"',
      type: 'external_url',
      style: 'outline'
    },
    // ===== CTA FINAL =====
    {
      key: 'formulario_cta',
      label_default: 'Aplicar al Programa',
      slot: 'cta',
      description: 'Botón principal de conversión en la sección CTA final',
      type: 'external_url',
      style: 'primary'
    },
    // ===== FOOTER =====
    {
      key: 'directorio',
      label_default: 'Ver Directorio',
      slot: 'footer',
      description: 'Acceso al directorio de coaches/mentores certificados',
      type: 'external_url',
      style: 'outline'
    }
  ],
  'suitex': [
    {
      key: 'demo_hero',
      label_default: 'Agendar Demo',
      slot: 'hero_primary',
      description: 'Botón principal para solicitar una demostración del producto',
      type: 'external_url',
      style: 'primary'
    },
    {
      key: 'whatsapp_hero',
      label_default: 'Contactar por WhatsApp',
      slot: 'hero_secondary',
      description: 'Contacto directo para consultas rápidas',
      type: 'external_url',
      style: 'secondary'
    },
    {
      key: 'prueba_cta',
      label_default: 'Empezar Prueba Gratis',
      slot: 'cta',
      description: 'Acceso a prueba gratuita en la sección CTA',
      type: 'external_url',
      style: 'primary'
    },
    {
      key: 'comprar_pricing',
      label_default: 'Comprar Ahora',
      slot: 'pricing',
      description: 'Botón de compra en la sección de precios',
      type: 'external_url',
      style: 'primary'
    }
  ]
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Obtener template component
export const getTemplate = (templateKey) => {
  const template = TEMPLATE_REGISTRY[templateKey];
  if (!template) {
    console.warn(`Template "${templateKey}" not found. Using "${DEFAULT_TEMPLATE_KEY}".`);
    return TEMPLATE_REGISTRY[DEFAULT_TEMPLATE_KEY];
  }
  return template;
};

// Lista de templates disponibles
export const getAvailableTemplates = () => {
  return Object.keys(TEMPLATE_REGISTRY).map(key => ({
    key,
    name: key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ')
  }));
};

// Obtener slots para un template
export const getSlotsForTemplate = (templateKey) => {
  return TEMPLATE_SLOTS[templateKey] || TEMPLATE_SLOTS[DEFAULT_TEMPLATE_KEY] || [];
};

// Obtener descripción de un slot
export const getSlotDescription = (templateKey, slotKey) => {
  const slots = getSlotsForTemplate(templateKey);
  const slot = slots.find(s => s.key === slotKey);
  return slot ? slot.description : slotKey;
};

// ============================================
// HELPERS PARA BOTONES (OPCIÓN B)
// ============================================

// Obtener todos los botones de un template
export const getButtonsForTemplate = (templateKey) => {
  return TEMPLATE_BUTTONS[templateKey] || TEMPLATE_BUTTONS[DEFAULT_TEMPLATE_KEY] || [];
};

// Obtener un botón específico por key
export const getButtonByKey = (templateKey, buttonKey) => {
  const buttons = getButtonsForTemplate(templateKey);
  return buttons.find(b => b.key === buttonKey) || null;
};

// Obtener el slot de un botón (único y fijo)
export const getSlotForButton = (templateKey, buttonKey) => {
  const button = getButtonByKey(templateKey, buttonKey);
  return button ? button.slot : null;
};

// Obtener label default de un botón
export const getButtonDefaultLabel = (templateKey, buttonKey) => {
  const button = getButtonByKey(templateKey, buttonKey);
  return button ? button.label_default : buttonKey;
};

// Obtener botones para un slot específico (debería ser máximo 1 en Opción B)
export const getButtonsForSlot = (templateKey, slotKey) => {
  const buttons = getButtonsForTemplate(templateKey);
  return buttons.filter(b => b.slot === slotKey);
};

// Obtener info completa de un slot (incluyendo su botón)
export const getSlotWithButton = (templateKey, slotKey) => {
  const slots = getSlotsForTemplate(templateKey);
  const slot = slots.find(s => s.key === slotKey);
  const buttons = getButtonsForSlot(templateKey, slotKey);
  return {
    ...slot,
    button: buttons[0] || null
  };
};

// ============================================
// DEPRECATED - Para migración
// ============================================
// Estas funciones se mantienen por backward compatibility
// pero serán eliminadas en futuras versiones

export const getAllowedSlotsForButton = (templateKey, buttonKey) => {
  // En Opción B, cada botón tiene un único slot
  const button = getButtonByKey(templateKey, buttonKey);
  if (!button) return [];
  const allSlots = getSlotsForTemplate(templateKey);
  return allSlots.filter(slot => slot.key === button.slot);
};

export const isSlotAllowedForButton = (templateKey, buttonKey, slotKey) => {
  const button = getButtonByKey(templateKey, buttonKey);
  if (!button) return false;
  return button.slot === slotKey;
};

export default TEMPLATE_REGISTRY;
