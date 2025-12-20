/**
 * TEMPLATE REGISTRY - Sistema de Templates Multi-Campaña
 * ======================================================
 * 
 * ARQUITECTURA:
 * - SLOT = ubicación visual (hero, cta, footer)
 * - BOTÓN = elemento interactivo concreto del template
 * - ACCIÓN = configuración que conecta un botón con URLs de mentor
 * 
 * FLUJO:
 * BOTÓN (del template) → ACCIÓN (configurada por admin) → SLOT (dónde aparece) → RENDER
 * 
 * CÓMO AGREGAR UN NUEVO TEMPLATE:
 * 1. Crear el componente en /app/frontend/src/templates/Landing[Nombre].jsx
 * 2. Importarlo aquí
 * 3. Agregarlo a TEMPLATE_REGISTRY
 * 4. Definir sus SLOTS en TEMPLATE_SLOTS
 * 5. Definir sus BOTONES en TEMPLATE_BUTTONS
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
// Ubicaciones visuales donde pueden aparecer botones
export const TEMPLATE_SLOTS = {
  'cpn': [
    { 
      key: 'hero_primary', 
      label: 'Hero - Botón Principal',
      description: 'Botón grande y destacado en la sección principal'
    },
    { 
      key: 'hero_secondary', 
      label: 'Hero - Botones Secundarios',
      description: 'Botones más pequeños debajo del principal'
    },
    { 
      key: 'awakening', 
      label: 'Sección Despertar',
      description: 'Botón en la sección "Es momento de despertar"'
    },
    { 
      key: 'is_for_you', 
      label: 'Sección ¿Es para ti?',
      description: 'Botón en la sección de perfil ideal'
    },
    { 
      key: 'why_inverser', 
      label: 'Sección ¿Por qué InverSer?',
      description: 'Botón en la sección de beneficios'
    },
    { 
      key: 'cta', 
      label: 'CTA Final',
      description: 'Sección de llamada a la acción al final'
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
      description: 'Botones adicionales en el Hero'
    },
    { 
      key: 'cta', 
      label: 'CTA Final',
      description: 'Botón en la sección final de conversión'
    },
    { 
      key: 'pricing', 
      label: 'Pricing',
      description: 'Botones en la sección de precios'
    }
  ]
};

// ============================================
// BOTONES POR TEMPLATE
// ============================================
// Define los botones REALES que existen en cada template.
// Cada botón debe corresponder a un CTA visible en el diseño.
// - key: identificador único
// - label_default: texto predeterminado del botón
// - description: qué hace este botón (para el admin)
// - allowed_slots: dónde puede aparecer este botón
// - type: 'external_url' (abre URL del mentor) o 'internal' (scroll interno)
// - icon: ícono sugerido (opcional)
// - style: estilo visual (primary, secondary, outline)
export const TEMPLATE_BUTTONS = {
  'cpn': [
    // ===== HERO SECTION =====
    {
      key: 'agenda',
      label_default: 'Agendar Llamada',
      description: 'Botón principal del Hero para agendar una llamada/cita',
      allowed_slots: ['hero_primary', 'cta'],
      type: 'external_url',
      icon: 'calendar',
      style: 'primary'
    },
    {
      key: 'whatsapp',
      label_default: 'Hablar por WhatsApp',
      description: 'Contacto directo vía WhatsApp (Hero secundario)',
      allowed_slots: ['hero_secondary', 'cta', 'footer'],
      type: 'external_url',
      icon: 'message-circle',
      style: 'secondary'
    },
    // ===== AWAKENING SECTION =====
    {
      key: 'iniciar_transformacion',
      label_default: 'Quiero Iniciar mi Transformación',
      description: 'Botón en la sección "Es momento de despertar"',
      allowed_slots: ['awakening', 'cta'],
      type: 'external_url',
      icon: 'sparkles',
      style: 'primary'
    },
    // ===== IS FOR YOU SECTION =====
    {
      key: 'solicitar_entrevista',
      label_default: 'Solicita tu Entrevista',
      description: 'Botón en la sección "¿Es para ti?"',
      allowed_slots: ['is_for_you', 'cta'],
      type: 'external_url',
      icon: 'user-check',
      style: 'primary'
    },
    // ===== WHY INVERSER SECTION =====
    {
      key: 'solicitar_info',
      label_default: 'Solicita Información',
      description: 'Botón en la sección "¿Por qué InverSer?"',
      allowed_slots: ['why_inverser', 'cta'],
      type: 'external_url',
      icon: 'info',
      style: 'outline'
    },
    // ===== CTA / FOOTER =====
    {
      key: 'formulario',
      label_default: 'Aplicar / Registrarme',
      description: 'Formulario de aplicación o registro al programa',
      allowed_slots: ['cta', 'footer'],
      type: 'external_url',
      icon: 'file-text',
      style: 'outline'
    },
    {
      key: 'directorio',
      label_default: 'Ver Directorio',
      description: 'Acceso al directorio de coaches/mentores',
      allowed_slots: ['footer'],
      type: 'external_url',
      icon: 'users',
      style: 'outline'
    },
    // ===== FIXED CONTACT (Footer) =====
    {
      key: 'email_contacto',
      label_default: 'info@inverser.us',
      description: 'Email de contacto en el footer (fijo)',
      allowed_slots: ['footer'],
      type: 'external_url',
      icon: 'mail',
      style: 'link'
    },
    {
      key: 'telefono_contacto',
      label_default: '+1 786 954 7264',
      description: 'Teléfono/WhatsApp de contacto en footer (fijo)',
      allowed_slots: ['footer'],
      type: 'external_url',
      icon: 'phone',
      style: 'link'
    }
  ],
  'suitex': [
    {
      key: 'demo',
      label_default: 'Agendar Demo',
      description: 'Botón principal para solicitar una demostración del producto',
      allowed_slots: ['hero_primary', 'cta', 'pricing'],
      type: 'external_url',
      icon: 'calendar',
      style: 'primary'
    },
    {
      key: 'whatsapp',
      label_default: 'Contactar por WhatsApp',
      description: 'Contacto directo para consultas rápidas',
      allowed_slots: ['hero_secondary', 'cta'],
      type: 'external_url',
      icon: 'message-circle',
      style: 'secondary'
    },
    {
      key: 'prueba_gratis',
      label_default: 'Prueba Gratis',
      description: 'Acceso a prueba gratuita del producto',
      allowed_slots: ['hero_secondary', 'pricing'],
      type: 'external_url',
      icon: 'zap',
      style: 'outline'
    }
  ]
};
    },
    {
      key: 'directorio',
      label_default: 'Ver Directorio',
      description: 'Acceso al directorio de coaches/mentores',
      allowed_slots: ['footer'],
      icon: 'users',
      style: 'outline'
    }
  ],
  'suitex': [
    {
      key: 'demo',
      label_default: 'Agendar Demo',
      description: 'Botón principal para solicitar una demostración del producto',
      allowed_slots: ['hero_primary', 'cta', 'pricing'],
      icon: 'calendar',
      style: 'primary'
    },
    {
      key: 'whatsapp',
      label_default: 'Contactar por WhatsApp',
      description: 'Contacto directo para consultas rápidas',
      allowed_slots: ['hero_secondary', 'cta'],
      icon: 'message-circle',
      style: 'secondary'
    },
    {
      key: 'prueba_gratis',
      label_default: 'Prueba Gratis',
      description: 'Acceso a prueba gratuita del producto',
      allowed_slots: ['hero_secondary', 'pricing'],
      icon: 'zap',
      style: 'outline'
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
// NUEVOS HELPERS PARA BOTONES
// ============================================

// Obtener botones disponibles para un template
export const getButtonsForTemplate = (templateKey) => {
  return TEMPLATE_BUTTONS[templateKey] || TEMPLATE_BUTTONS[DEFAULT_TEMPLATE_KEY] || [];
};

// Obtener un botón específico por key
export const getButtonByKey = (templateKey, buttonKey) => {
  const buttons = getButtonsForTemplate(templateKey);
  return buttons.find(b => b.key === buttonKey) || null;
};

// Obtener slots permitidos para un botón específico
export const getAllowedSlotsForButton = (templateKey, buttonKey) => {
  const button = getButtonByKey(templateKey, buttonKey);
  if (!button) return [];
  
  const allSlots = getSlotsForTemplate(templateKey);
  return allSlots.filter(slot => button.allowed_slots.includes(slot.key));
};

// Verificar si un slot está permitido para un botón
export const isSlotAllowedForButton = (templateKey, buttonKey, slotKey) => {
  const button = getButtonByKey(templateKey, buttonKey);
  if (!button) return true; // Permitir todo si no hay botón definido (backward compat)
  return button.allowed_slots.includes(slotKey);
};

// Obtener label default de un botón
export const getButtonDefaultLabel = (templateKey, buttonKey) => {
  const button = getButtonByKey(templateKey, buttonKey);
  return button ? button.label_default : buttonKey;
};

export default TEMPLATE_REGISTRY;
