/**
 * TEMPLATE REGISTRY - Sistema de Templates Multi-Campaña
 * ======================================================
 * 
 * Este archivo es el registro central de todos los templates de landing disponibles.
 * 
 * CÓMO FUNCIONA:
 * 1. Cada campaña en la BD tiene un campo `template_key`
 * 2. DynamicLandingPage usa este archivo para mapear template_key → componente
 * 3. Si el template_key no existe, se usa el template "generic" como fallback
 * 
 * CÓMO AGREGAR UN NUEVO TEMPLATE:
 * 1. Crear el componente en /app/frontend/src/templates/Landing[Nombre].jsx
 * 2. Importarlo aquí abajo
 * 3. Agregarlo al objeto TEMPLATE_REGISTRY con su key
 * 4. Actualizar la campaña en Admin con el nuevo template_key
 * 
 * EJEMPLO:
 * // 1. Crear /app/frontend/src/templates/LandingMentorProgram.jsx
 * // 2. Importar:
 * import LandingMentorProgram from './LandingMentorProgram';
 * // 3. Agregar al registry:
 * 'mentor-program': LandingMentorProgram,
 * 
 * CONVENCIÓN DE NOMBRES:
 * - Archivo: Landing[NombreEnPascalCase].jsx
 * - template_key: nombre-en-kebab-case
 * 
 * TEMPLATES DISPONIBLES:
 * - generic: Template por defecto, neutral, para nuevas campañas
 * - cpn: Certificación Profesional NeuroCoaching
 * - suitex: Suitex - Oficina Digital SaaS
 */

import LandingGeneric from './LandingGeneric';
import LandingCPN from './LandingCPN';
import LandingSuitex from './LandingSuitex';

// Registry de templates disponibles
export const TEMPLATE_REGISTRY = {
  // Template por defecto - usar para nuevas campañas
  'generic': LandingGeneric,
  
  // Certificación Profesional NeuroCoaching
  'cpn': LandingCPN,
  
  // Suitex - Oficina Digital SaaS
  'suitex': LandingSuitex,
  
  // ============================================
  // AGREGAR NUEVOS TEMPLATES AQUÍ
  // ============================================
  // 'mentor-program': LandingMentorProgram,
  // 'eventos': LandingEventos,
  // 'workshops': LandingWorkshops,
};

// Template por defecto cuando no se encuentra el template_key
export const DEFAULT_TEMPLATE_KEY = 'generic';

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

export default TEMPLATE_REGISTRY;
