/**
 * Helper para filtrar acciones por slot
 * Usado en los templates de landing para renderizar botones en la ubicación correcta
 */

/**
 * Filtra las acciones que deben aparecer en un slot específico
 * @param {Array} actions - Lista de acciones con display_slots
 * @param {string} slotKey - El slot a filtrar (ej: 'hero_primary', 'cta')
 * @returns {Array} - Acciones que deben aparecer en ese slot
 */
export const getActionsForSlot = (actions, slotKey) => {
  if (!actions || !Array.isArray(actions)) return [];
  
  return actions.filter(action => {
    const slots = action.display_slots || ['cta'];  // Fallback to cta
    return slots.includes(slotKey);
  });
};

/**
 * Obtiene la primera acción para un slot (útil para botones principales)
 * @param {Array} actions - Lista de acciones con display_slots
 * @param {string} slotKey - El slot a buscar
 * @returns {Object|null} - La primera acción o null
 */
export const getPrimaryActionForSlot = (actions, slotKey) => {
  const slotActions = getActionsForSlot(actions, slotKey);
  return slotActions.length > 0 ? slotActions[0] : null;
};

/**
 * Verifica si hay acciones para un slot
 * @param {Array} actions - Lista de acciones con display_slots
 * @param {string} slotKey - El slot a verificar
 * @returns {boolean}
 */
export const hasActionsForSlot = (actions, slotKey) => {
  return getActionsForSlot(actions, slotKey).length > 0;
};

export default getActionsForSlot;
