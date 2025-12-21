# TEMPLATE SYSTEM DOCUMENTATION
## Sistema de Templates Multi-Campaña - InverSer

---

## 🎯 PRINCIPIO FUNDAMENTAL

**El diseño de la landing es INMUTABLE.**

Los templates definen un layout fijo con botones anclados en posiciones específicas. 
El mentor/admin configura URLs y labels, pero NUNCA puede alterar el layout ni ocultar elementos.

---

## 📐 ARQUITECTURA

```
TEMPLATE (diseño fijo)
└── define BOTONES (ButtonAnchors en posiciones fijas)
    └── cada BOTÓN tiene:
        - key única
        - label_default (texto visible)
        - slot (ubicación fija - SOLO LECTURA)
        - description (explicación funcional)
        - link_type: "mentor" | "fixed"

ACCIÓN (configuración)
└── personaliza UN botón específico
└── NO cambia ubicación
└── solo controla: label override, estado (active/inactive/retired)

MENTOR
└── solo asigna URL a cada acción
└── NO puede ocultar botones
└── NO puede cambiar layout
```

---

## 🔴 REGLAS INNEGOCIABLES

### 1. Botones SIEMPRE visibles
```javascript
// ❌ PROHIBIDO - Ocultar botón por falta de URL
if (!url) return null;

// ✅ CORRECTO - Renderizar siempre, disabled si falta URL
return <Button disabled={!url}>...</Button>;
```

### 2. Layout fijo por template
- Cada template tiene N botones en posiciones específicas
- El número de botones en `/admin/templates` = botones en `/admin/actions` = ButtonAnchors en landing
- NO hay botones "dinámicos" ni "generados"

### 3. Estados de botón
| Estado | URL | Comportamiento |
|--------|-----|----------------|
| Activo + URL | ✅ | Funcional, navegación habilitada |
| Activo sin URL | ❌ | Visible, DISABLED, tooltip "Enlace no configurado" |
| Inactivo | - | Visible, DISABLED, tooltip "Desactivado" |
| Retired | - | Visible, DISABLED (solo para legacy) |

### 4. link_type
- `"mentor"`: URL específica por mentor (Calendly, WhatsApp, etc.)
- `"fixed"`: URL fija de campaña (Directorio, Pricing, etc.)

---

## 🛠️ CÓMO CREAR UN NUEVO TEMPLATE

### Paso 1: Crear el componente Landing
```jsx
// /app/frontend/src/templates/LandingNuevo.jsx
import ButtonAnchor, { prepareAnchorData } from '../components/ButtonAnchor';

const LandingNuevo = ({ mentorData, onActionClick }) => {
  const { actions, mentorLinks, campaignLinks } = prepareAnchorData(mentorData);
  const templateKey = 'nuevo';

  return (
    <div>
      {/* Hero Section - Botones anclados */}
      <section>
        <ButtonAnchor
          buttonKey="cta_hero"
          templateKey={templateKey}
          actions={actions}
          mentorLinks={mentorLinks}
          campaignLinks={campaignLinks}
          onActionClick={onActionClick}
          variant="primary"
          size="lg"
        />
      </section>
      
      {/* Otras secciones con sus ButtonAnchors */}
    </div>
  );
};
```

### Paso 2: Definir botones en TEMPLATE_BUTTONS
```javascript
// /app/frontend/src/templates/index.js

export const TEMPLATE_BUTTONS = {
  // ...templates existentes...
  
  'nuevo': [
    {
      key: 'cta_hero',
      label_default: 'Comenzar Ahora',
      slot: 'hero_primary',
      description: 'Botón principal del Hero',
      link_type: 'mentor',  // o 'fixed'
      style: 'primary'
    },
    // ... más botones
  ]
};
```

### Paso 3: Registrar el template
```javascript
// /app/frontend/src/templates/index.js

import LandingNuevo from './LandingNuevo';

export const TEMPLATE_REGISTRY = {
  'cpn': LandingCPN,
  'suitex': LandingSuitex,
  'nuevo': LandingNuevo,  // Añadir aquí
};
```

### Paso 4: Definir slots
```javascript
export const TEMPLATE_SLOTS = {
  'nuevo': [
    { key: 'hero_primary', label: 'Hero - Botón Principal', description: '...' },
    // ... más slots
  ]
};
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

Al crear o modificar un template, verificar:

- [ ] Todos los ButtonAnchors están en posiciones fijas del diseño
- [ ] Número de botones en TEMPLATE_BUTTONS = número de ButtonAnchors en el componente
- [ ] Ningún ButtonAnchor tiene `hideIfNoUrl` (deprecated)
- [ ] Mentor sin URLs ve todos los botones (disabled pero visibles)
- [ ] El layout NO cambia entre mentores con/sin URLs configuradas
- [ ] Cada slot tiene máximo 1 botón asignado (1:1)

---

## 📝 NOTAS ADICIONALES

### Nota Interna (internal_note)
- Campo opcional en cada acción
- Visible para admin en modal de edición de links
- Visible para mentor en página de magic link
- Uso: guiar al usuario sobre qué URL debe colocar

### Migración de templates legacy
Si un template existente usa el patrón antiguo (renderizar lista de acciones):
1. Identificar cada CTA/botón en el diseño original
2. Crear ButtonAnchor para cada uno en su posición exacta
3. Eliminar código de "lista de acciones"
4. Verificar que el número de botones coincide con TEMPLATE_BUTTONS

---

## 🔗 ARCHIVOS DE REFERENCIA

- `/app/frontend/src/components/ButtonAnchor.jsx` - Componente principal
- `/app/frontend/src/templates/index.js` - Registry y definiciones
- `/app/frontend/src/templates/LandingCPN.jsx` - Ejemplo de template
- `/app/backend/models/action.py` - Modelo de datos

---

*Última actualización: Diciembre 2025*
