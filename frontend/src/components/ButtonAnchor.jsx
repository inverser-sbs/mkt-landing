/**
 * ButtonAnchor - Sistema de Anclaje de Botones
 * =============================================
 * 
 * REGLA FUNDAMENTAL (InverSer):
 * - Los botones SIEMPRE se renderizan en su posición fija del diseño
 * - NUNCA se ocultan por falta de URL
 * - Si falta URL → botón visible pero DISABLED con indicador visual
 * - El layout de la landing es INMUTABLE
 * 
 * ARQUITECTURA:
 * - Cada ButtonAnchor es un punto fijo en el diseño del template
 * - El anchor resuelve: label (de action o default), URL (de mentor o fixed), y estado
 * - NO crea botones nuevos, solo RENDERIZA el botón definido en el diseño
 * 
 * PROPS:
 * - buttonKey: key del botón en TEMPLATE_BUTTONS (ej: "agenda_hero")
 * - actions: array de acciones configuradas para el mentor/campaña
 * - mentorLinks: objeto con URLs del mentor { action_key: url }
 * - campaignLinks: objeto con URLs fijas de la campaña (para link_type="fixed")
 * - onActionClick: callback opcional para tracking
 * - variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'cta' (estilo visual)
 * - className: clases adicionales
 * - size: 'sm' | 'default' | 'lg'
 */

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Calendar, Phone, MessageCircle, ExternalLink, ArrowRight, FileText, Users, AlertCircle } from 'lucide-react';
import { getButtonByKey } from '../templates';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

// Mapeo de iconos por button_key
const BUTTON_ICONS = {
  'agenda_hero': Calendar,
  'whatsapp_hero': Phone,
  'iniciar_transformacion': ArrowRight,
  'solicitar_entrevista': Calendar,
  'solicitar_info': FileText,
  'formulario_cta': MessageCircle,
  'ver_perfil': Users,
  'ir_perfil_footer': Users,
  // Suitex
  'demo_hero': Calendar,
  'prueba_cta': ArrowRight,
  'comprar_pricing': ExternalLink,
  // Default
  'default': ExternalLink
};

// Estilos por variante - Estado ACTIVO (con URL)
// REGLA: Todos los botones tienen el MISMO efecto hover (scale-105 + shadow)
const VARIANT_STYLES = {
  primary: "bg-[#c4ff0f] text-gray-900 hover:bg-[#b3ef00] font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl",
  secondary: "bg-[#c4ff0f] text-gray-900 hover:bg-[#b3ef00] font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl",
  outline: "bg-[#c4ff0f] text-gray-900 hover:bg-[#b3ef00] font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl",
  ghost: "bg-[#c4ff0f]/80 text-gray-900 hover:bg-[#b3ef00] font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg",
  cta: "bg-[#c4ff0f] text-gray-900 hover:bg-[#b3ef00] font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
};

// Estilos por variante - Estado DISABLED (sin URL)
const DISABLED_STYLES = {
  primary: "bg-gray-200 text-gray-400 font-semibold cursor-not-allowed",
  secondary: "bg-gray-200 text-gray-400 font-semibold cursor-not-allowed",
  outline: "bg-gray-200 text-gray-400 font-semibold cursor-not-allowed",
  ghost: "bg-gray-100 text-gray-400 font-medium cursor-not-allowed",
  cta: "bg-gray-200 text-gray-400 font-semibold cursor-not-allowed"
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
  size = 'default'
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // 1. Obtener la definición del botón del template
  const buttonDef = getButtonByKey(templateKey, buttonKey);
  
  if (!buttonDef) {
    console.warn(`ButtonAnchor: buttonKey "${buttonKey}" not found in template "${templateKey}"`);
    // NUNCA retornar null - siempre renderizar algo para mantener el layout
    return (
      <Button disabled className="bg-red-100 text-red-500 cursor-not-allowed">
        <AlertCircle className="w-4 h-4 mr-2" />
        Botón no configurado
      </Button>
    );
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
  
  // 5. Determinar estados
  const isActionActive = action ? action.active !== false : true;
  const hasUrl = !!url && url.trim() !== '';
  const isRetired = action?.status === 'retired';
  
  // 6. REGLA FUNDAMENTAL: SIEMPRE renderizar, NUNCA ocultar
  // Solo excepción: si la acción está "retired" Y no existe en el template actual
  // Pero incluso retired se renderiza como disabled para no romper el layout
  
  // 7. Determinar si el botón está funcional
  const isClickable = hasUrl && isActionActive && !isRetired;
  
  // 8. Obtener icono
  const Icon = BUTTON_ICONS[buttonKey] || BUTTON_ICONS['default'];
  
  // 9. Manejar click
  const handleClick = (e) => {
    if (!isClickable) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    if (onActionClick) {
      onActionClick(buttonKey, { label, url, action });
    }
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  
  // 10. Determinar estilos según estado
  const getButtonStyles = () => {
    if (!isClickable) {
      return DISABLED_STYLES[variant] || DISABLED_STYLES.primary;
    }
    return VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    default: 'px-8 py-4 text-base',
    lg: 'px-10 py-6 text-lg'
  };
  
  // 11. Mensaje de tooltip según estado
  const getTooltipMessage = () => {
    if (isRetired) return "Este botón está archivado";
    if (!isActionActive) return "Este botón está desactivado";
    if (!hasUrl) return "Enlace no configurado";
    return null;
  };
  
  const tooltipMessage = getTooltipMessage();
  
  // 12. Renderizar botón (SIEMPRE visible)
  const buttonElement = (
    <Button
      onClick={handleClick}
      aria-disabled={!isClickable}
      className={`
        ${getButtonStyles()}
        ${sizeClasses[size]}
        ${className}
        ${!isClickable ? 'pointer-events-auto' : ''}
      `}
    >
      {!hasUrl && !isRetired && (
        <AlertCircle className="w-4 h-4 mr-2 text-current opacity-70" />
      )}
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </Button>
  );
  
  // 13. Si necesita tooltip (estado incompleto), envolverlo
  if (tooltipMessage) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block">
              {buttonElement}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-gray-900 text-white text-sm px-3 py-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {tooltipMessage}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return buttonElement;
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
