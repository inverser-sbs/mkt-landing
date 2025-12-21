/**
 * ButtonAnchor - Sistema de Anclaje de Botones
 * =============================================
 * 
 * ARQUITECTURA:
 * - Cada ButtonAnchor es un punto fijo en el diseño del template
 * - El anchor resuelve: label (de action o default), URL (de mentor o fixed), y estado (habilitado/deshabilitado)
 * - NO crea botones nuevos, solo RENDERIZA el botón definido en el diseño
 * 
 * PROPS:
 * - buttonKey: key del botón en TEMPLATE_BUTTONS (ej: "agenda_hero")
 * - actions: array de acciones configuradas para el mentor/campaña
 * - mentorLinks: objeto con URLs del mentor { action_key: url }
 * - campaignLinks: objeto con URLs fijas de la campaña (para link_type="fixed")
 * - onActionClick: callback opcional para tracking
 * - variant: 'primary' | 'secondary' | 'outline' | 'ghost' (estilo visual)
 * - className: clases adicionales
 * - hideIfNoUrl: si true, oculta el botón si no hay URL disponible
 */

import React from 'react';
import { Button } from './ui/button';
import { Calendar, Phone, MessageCircle, ExternalLink, ArrowRight, FileText, Users } from 'lucide-react';
import { getButtonByKey } from '../templates';

// Mapeo de iconos por button_key
const BUTTON_ICONS = {
  'agenda_hero': Calendar,
  'whatsapp_hero': Phone,
  'iniciar_transformacion': ArrowRight,
  'solicitar_entrevista': Calendar,
  'solicitar_info': FileText,
  'formulario_cta': MessageCircle,
  'directorio': Users,
  // Suitex
  'demo_hero': Calendar,
  'prueba_cta': ArrowRight,
  'comprar_pricing': ExternalLink,
  // Default
  'default': ExternalLink
};

// Estilos por variante
const VARIANT_STYLES = {
  primary: "bg-[#c4ff0f] text-gray-900 hover:bg-[#b3ef00] font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl",
  secondary: "border-2 border-[#7c3aed] text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white transition-all duration-300",
  outline: "border-2 border-white text-white hover:bg-white hover:text-[#7c3aed] transition-all duration-300",
  ghost: "text-[#7c3aed] hover:bg-purple-50 transition-all duration-300",
  cta: "bg-[#c4ff0f] text-gray-900 hover:bg-[#b3ef00] font-semibold transition-all duration-300 hover:scale-105"
};

const ButtonAnchor = ({
  buttonKey,
  templateKey = 'cpn',
  actions = [],
  mentorLinks = {},
  campaignLinks = {},
  onActionClick,
  variant = 'primary',
  className = '',
  hideIfNoUrl = true,
  size = 'default' // 'default' | 'sm' | 'lg'
}) => {
  // 1. Obtener la definición del botón del template
  const buttonDef = getButtonByKey(templateKey, buttonKey);
  
  if (!buttonDef) {
    console.warn(`ButtonAnchor: buttonKey "${buttonKey}" not found in template "${templateKey}"`);
    return null;
  }

  // 2. Buscar la acción configurada para este botón
  const action = actions.find(a => a.button_key === buttonKey || a.action_key === buttonKey);
  
  // 3. Determinar el label (prioridad: action.label > buttonDef.label_default)
  const label = action?.label || buttonDef.label_default;
  
  // 4. Determinar la URL según link_type
  let url = null;
  const linkType = buttonDef.link_type || 'mentor';
  
  if (linkType === 'fixed') {
    // URL fija de la campaña
    url = campaignLinks[buttonKey] || buttonDef.fixed_url || null;
  } else {
    // URL del mentor
    url = mentorLinks[buttonKey] || action?.url || null;
  }
  
  // 5. Determinar si el botón está habilitado
  const isActionActive = action ? action.active !== false : true;
  const hasUrl = !!url;
  
  // 6. Decidir si renderizar
  if (hideIfNoUrl && !hasUrl && linkType === 'mentor') {
    // Para botones de mentor, ocultar si no hay URL
    return null;
  }
  
  // 7. Obtener icono
  const Icon = BUTTON_ICONS[buttonKey] || BUTTON_ICONS['default'];
  
  // 8. Manejar click
  const handleClick = () => {
    if (onActionClick) {
      onActionClick(buttonKey, { label, url, action });
    }
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  
  // 9. Determinar estilos
  const variantStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    default: 'px-8 py-4 text-base',
    lg: 'px-10 py-6 text-lg'
  };
  
  // 10. Estado deshabilitado
  const isDisabled = !hasUrl && linkType === 'mentor';
  
  return (
    <Button
      onClick={handleClick}
      disabled={isDisabled || !isActionActive}
      className={`
        ${variantStyle}
        ${sizeClasses[size]}
        ${className}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </Button>
  );
};

export default ButtonAnchor;

// =============================================
// HELPER: Preparar datos para anchors
// =============================================
// Uso: const { mentorLinks, campaignLinks } = prepareAnchorData(mentorData);

export const prepareAnchorData = (mentorData) => {
  const actions = mentorData?.actions || [];
  const links = mentorData?.links || {};
  
  // Construir objeto de links del mentor
  const mentorLinks = {};
  actions.forEach(action => {
    if (action.url) {
      mentorLinks[action.button_key || action.action_key] = action.url;
    }
  });
  
  // Merge con links directos si existen
  Object.assign(mentorLinks, links);
  
  return {
    actions,
    mentorLinks,
    campaignLinks: mentorData?.campaign?.fixed_links || {}
  };
};
