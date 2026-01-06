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
import LandingMPP from './LandingMPP';

// ============================================
// TEMPLATE REGISTRY - Componentes
// ============================================
export const TEMPLATE_REGISTRY = {
  'cpn': LandingCPN,
  'suitex': LandingSuitex,
  'mpp': LandingMPP,
};

export const DEFAULT_TEMPLATE_KEY = 'cpn';

// ============================================
// SLOTS POR TEMPLATE
// ============================================
// Ubicaciones visuales fijas en cada landing
export const TEMPLATE_SLOTS = {
  'cpn': [
    { key: 'navbar', label: 'Navbar - Inscríbete', description: 'Botón en el menú de navegación' },
    { key: 'hero_primary', label: 'Hero - Agendar Llamada', description: 'Botón principal en el card del mentor' },
    { key: 'hero_secondary', label: 'Hero - WhatsApp', description: 'Botón secundario en el card del mentor' },
    { key: 'hero_profile', label: 'Hero - Ver Perfil', description: 'Botón para ver perfil del mentor' },
    { key: 'transforma_ser', label: 'TransformaSER - Iniciar', description: 'Botón en la sección de filosofía del SER' },
    { key: 'es_para_ti', label: '¿Es para ti? - Entrevista', description: 'Botón en la sección de perfil ideal' },
    { key: 'siguiente_paso', label: 'Siguiente Paso - Partner', description: 'Botón para conocer el Mentor Program' },
    { key: 'cta', label: 'CTA Final - Aplicar', description: 'Botón principal de conversión' },
    { key: 'footer_profile', label: 'Footer - Ir al Perfil', description: 'Botón en el footer' }
  ],
  'suitex': [
    { key: 'hero_primary', label: 'Hero - Botón Principal', description: 'Botón de Demo/Acción principal en el Hero' },
    { key: 'hero_secondary', label: 'Hero - Botón Secundario', description: 'Botón adicional en el Hero' },
    { key: 'cta', label: 'CTA Final', description: 'Botón en la sección final de conversión' },
    { key: 'pricing', label: 'Pricing', description: 'Botón en la sección de precios' }
  ],
  'mpp': [
    { key: 'navbar', label: 'Navbar - Postular', description: 'Botón en el menú de navegación' },
    { key: 'hero_primary', label: 'Hero - Agendar Llamada', description: 'Botón principal en el Hero' },
    { key: 'hero_secondary', label: 'Hero - WhatsApp', description: 'Botón secundario en el Hero' },
    { key: 'hero_profile', label: 'Hero - Ver Perfil', description: 'Botón debajo de la foto del mentor' },
    { key: 'certificacion', label: 'Certificación - Ver', description: 'Botón para conocer la certificación' },
    { key: 'partner', label: 'Partner - Email', description: 'Botón de contacto en sección Partner' },
    { key: 'cta_primary', label: 'CTA Final - Aplicar', description: 'Botón principal del CTA final' },
    { key: 'cta_secondary', label: 'CTA Final - WhatsApp', description: 'Botón secundario del CTA final' },
    { key: 'faq_cta', label: 'FAQ - Quiero Unirme', description: 'Botón al final de las preguntas frecuentes' },
    { key: 'footer_profile', label: 'Footer - Ir al Perfil', description: 'Botón para ver perfil del mentor' }
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
// - link_type: 'mentor' (URL por mentor) o 'fixed' (URL fija de campaña)
// - style: estilo visual (primary, secondary, outline, link)
export const TEMPLATE_BUTTONS = {
  'cpn': [
    // ===== NAVBAR/HEADER =====
    {
      key: 'inscribete_nav',
      label_default: 'Inscríbete Ahora',
      slot: 'navbar',
      description: 'Botón del menú principal para inscripción rápida',
      link_type: 'mentor',
      style: 'primary'
    },
    // ===== HERO SECTION =====
    {
      key: 'agenda_hero',
      label_default: 'Agendar Llamada',
      slot: 'hero_primary',
      description: 'Botón principal del Hero para agendar una llamada con el mentor',
      link_type: 'mentor',
      style: 'primary'
    },
    {
      key: 'whatsapp_hero',
      label_default: 'WhatsApp',
      slot: 'hero_secondary',
      description: 'Contacto directo vía WhatsApp en el Hero',
      link_type: 'mentor',
      style: 'secondary'
    },
    {
      key: 'ver_perfil',
      label_default: 'Ver perfil',
      slot: 'hero_profile',
      description: 'Botón debajo de la foto del mentor en el Hero',
      link_type: 'mentor',
      style: 'outline'
    },
    // ===== TRANSFORMA SER SECTION =====
    {
      key: 'iniciar_transformacion',
      label_default: 'Quiero Iniciar mi Transformación',
      slot: 'transforma_ser',
      description: 'Botón en la sección de filosofía del SER',
      link_type: 'mentor',
      style: 'primary'
    },
    // ===== ES PARA TI SECTION =====
    {
      key: 'solicitar_entrevista',
      label_default: 'Solicita tu Entrevista',
      slot: 'es_para_ti',
      description: 'Botón en la sección "¿Es para ti?"',
      link_type: 'mentor',
      style: 'primary'
    },
    // ===== SIGUIENTE PASO (EX-PARTNER) =====
    {
      key: 'partner_cta',
      label_default: 'Conoce el Mentor Program',
      slot: 'siguiente_paso',
      description: 'Botón para conocer el camino como Mentor después de certificarte',
      link_type: 'mentor',
      style: 'primary'
    },
    // ===== CTA FINAL =====
    {
      key: 'formulario_cta',
      label_default: 'Aplicar al Programa',
      slot: 'cta',
      description: 'Botón principal de conversión en la sección CTA final',
      link_type: 'mentor',
      style: 'primary'
    },
    // ===== FOOTER =====
    {
      key: 'ir_perfil_footer',
      label_default: 'Ir al perfil',
      slot: 'footer_profile',
      description: 'Botón en el footer para acceder al perfil del mentor',
      link_type: 'mentor',
      style: 'ghost'
    }
  ],
      link_type: 'mentor',
      style: 'ghost'
    }
  ],
  'suitex': [
    {
      key: 'demo_hero',
      label_default: 'Agendar Demo',
      slot: 'hero_primary',
      description: 'Botón principal para solicitar una demostración del producto',
      link_type: 'mentor',
      style: 'primary'
    },
    {
      key: 'whatsapp_hero',
      label_default: 'Contactar por WhatsApp',
      slot: 'hero_secondary',
      description: 'Contacto directo para consultas rápidas',
      link_type: 'mentor',
      style: 'secondary'
    },
    {
      key: 'prueba_cta',
      label_default: 'Empezar Prueba Gratis',
      slot: 'cta',
      description: 'Acceso a prueba gratuita en la sección CTA',
      link_type: 'fixed',
      fixed_url: 'https://suitex.com/trial',
      style: 'primary'
    },
    {
      key: 'comprar_pricing',
      label_default: 'Comprar Ahora',
      slot: 'pricing',
      description: 'Botón de compra en la sección de precios',
      link_type: 'fixed',
      fixed_url: 'https://suitex.com/pricing',
      style: 'primary'
    }
  ],
  // ===== MPP - MENTOR & PARTNER PROGRAM =====
  'mpp': [
    // ===== NAVBAR =====
    {
      key: 'postular_nav_mpp',
      label_default: 'Quiero Postularme',
      slot: 'navbar',
      description: 'Botón del navbar para postularse al programa',
      link_type: 'mentor',
      style: 'primary'
    },
    // ===== HERO SECTION =====
    {
      key: 'agendar_mpp',
      label_default: 'Agendar Llamada',
      slot: 'hero_primary',
      description: 'Botón en el card del mentor para agendar llamada',
      link_type: 'mentor',
      style: 'primary'
    },
    {
      key: 'whatsapp_mpp',
      label_default: 'WhatsApp',
      slot: 'hero_secondary',
      description: 'Contacto directo vía WhatsApp',
      link_type: 'mentor',
      style: 'secondary'
    },
    {
      key: 'ver_perfil_mpp',
      label_default: 'Ver perfil',
      slot: 'hero_profile',
      description: 'Botón debajo de la foto del mentor para ver su perfil completo',
      link_type: 'mentor',
      style: 'ghost'
    },
    // ===== CERTIFICACIÓN SECTION =====
    {
      key: 'ver_certificacion_mpp',
      label_default: 'Conocer la Certificación',
      slot: 'certificacion',
      description: 'Botón para ver detalles de la certificación NeuroCoaching',
      link_type: 'mentor',
      style: 'primary'
    },
    // ===== PARTNER SECTION =====
    {
      key: 'email_mpp',
      label_default: 'Contactar por Email',
      slot: 'partner',
      description: 'Botón de contacto por email en la sección de monetización',
      link_type: 'mentor',
      style: 'primary'
    },
    // ===== CTA FINAL =====
    {
      key: 'aplicar_mpp',
      label_default: 'Aplicar al Programa',
      slot: 'cta_primary',
      description: 'Botón principal de conversión en el CTA final',
      link_type: 'mentor',
      style: 'primary'
    },
    // ===== FAQ SECTION =====
    {
      key: 'unirme_faq',
      label_default: 'Quiero Unirme',
      slot: 'faq_cta',
      description: 'Botón al final de las preguntas frecuentes',
      link_type: 'mentor',
      style: 'primary'
    },
    // ===== FOOTER =====
    {
      key: 'ir_perfil_footer_mpp',
      label_default: 'Ir al perfil',
      slot: 'footer_profile',
      description: 'Botón en el footer para acceder al perfil del mentor',
      link_type: 'mentor',
      style: 'ghost'
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
