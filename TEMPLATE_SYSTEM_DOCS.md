# Sistema de Templates Multi-Campaña - InverSer

## Descripción General

El sistema de templates permite que cada campaña de marketing tenga su propia landing page personalizada, mientras comparte el mismo backend, panel de admin, sistema de mentores y tracking.

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
├─────────────────────────────────────────────────────────────────┤
│  /:campaign/:slug  →  DynamicLandingPage.jsx                    │
│                              │                                   │
│                              ▼                                   │
│                    API: /api/public/mentor/{campaign}/{slug}     │
│                              │                                   │
│                              ▼                                   │
│                    Obtiene template_key de la campaña            │
│                              │                                   │
│                              ▼                                   │
│              TEMPLATE_REGISTRY[template_key]                     │
│                              │                                   │
│         ┌────────────────────┼────────────────────┐             │
│         ▼                    ▼                    ▼             │
│   LandingGeneric      LandingCPN           LandingSuitex        │
│   (fallback)          (neurocoaching)      (saas)               │
│                                                                  │
│   + Futuros templates creados por Emergent                       │
└─────────────────────────────────────────────────────────────────┘
```

## Componentes Principales

### 1. TEMPLATE_REGISTRY (`/app/frontend/src/templates/index.js`)

Archivo central que mapea `template_key` → componente React.

```javascript
// Templates disponibles
export const TEMPLATE_REGISTRY = {
  'generic': LandingGeneric,   // Template por defecto
  'cpn': LandingCPN,           // Certificación NeuroCoaching
  'suitex': LandingSuitex,     // Suitex SaaS
  // Agregar nuevos templates aquí
};

// Helper functions
export const getTemplate = (templateKey) => { ... }
export const getAvailableTemplates = () => { ... }
```

### 2. DynamicLandingPage (`/app/frontend/src/pages/DynamicLandingPage.jsx`)

Componente que:
1. Lee `campaign` y `slug` de la URL
2. Llama a la API para obtener datos
3. Extrae `template_key` de la respuesta
4. Renderiza el componente correcto usando `TEMPLATE_REGISTRY`

### 3. Templates (`/app/frontend/src/templates/`)

| Template | Archivo | Descripción |
|----------|---------|-------------|
| generic | LandingGeneric.jsx | Template neutro, para nuevas campañas |
| cpn | LandingCPN.jsx | Certificación NeuroCoaching |
| suitex | LandingSuitex.jsx | Suitex - Oficina Digital SaaS |

## Flujo de Trabajo: Crear Nueva Landing

### Paso 1: Crear Campaña en Admin
1. Ir a Admin → Campañas → Nueva Campaña
2. Configurar:
   - **key**: `mentor-program` (URL: `/mentor-program/<slug>`)
   - **name**: "Programa de Mentores"
   - **template_key**: `generic` (para tener landing funcional inmediata)
3. Guardar

### Paso 2: Verificar Landing Genérica
- Visitar `/<campaign-key>/noel-rivera`
- La landing genérica se renderiza automáticamente

### Paso 3: Crear Landing Personalizada (cuando sea necesario)
1. **Pedir a Emergent**:
   ```
   Crear LandingMentorProgram con:
   - Hero: [descripción]
   - Secciones: [lista]
   - CTAs: [botones]
   - Estilo: [colores, tema]
   ```

2. **Emergent crea**: `/app/frontend/src/templates/LandingMentorProgram.jsx`

3. **Emergent actualiza** `TEMPLATE_REGISTRY`:
   ```javascript
   import LandingMentorProgram from './LandingMentorProgram';
   
   export const TEMPLATE_REGISTRY = {
     // ...templates existentes
     'mentor-program': LandingMentorProgram,
   };
   ```

### Paso 4: Actualizar Campaña
1. Ir a Admin → Campañas → Editar "Programa de Mentores"
2. Cambiar `template_key` de `generic` a `mentor-program`
3. Guardar

### Paso 5: Verificar
- La campaña ahora usa el nuevo template personalizado

## Reglas de Fallback

1. Si `template_key` no existe en `TEMPLATE_REGISTRY`:
   - Se usa `generic` como fallback
   - Se muestra warning en consola del navegador
   - En Admin se muestra icono de advertencia

2. Si `template_key` está vacío o undefined:
   - Se usa `generic` por defecto

## Estructura de un Template

Cada template recibe las mismas props:

```jsx
const LandingExample = ({ mentorData, onActionClick }) => {
  const mentor = mentorData?.mentor || {};
  const actions = mentorData?.actions || [];
  const campaign = mentorData?.campaign || {};

  const handleActionClick = (action) => {
    if (onActionClick) onActionClick(action.action_key);
    window.open(action.url, '_blank');
  };

  return (
    <div>
      {/* Hero */}
      {/* Secciones */}
      {/* CTAs usando actions.map() */}
      {/* Footer */}
    </div>
  );
};
```

## Convención de Nombres

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Archivo | `Landing[PascalCase].jsx` | `LandingMentorProgram.jsx` |
| template_key | `kebab-case` | `mentor-program` |
| campaign.key | `kebab-case` | `mentor-program` |

## API Relacionada

### GET `/api/public/mentor/{campaign}/{slug}`

Respuesta:
```json
{
  "campaign": {
    "key": "mentor-program",
    "name": "Programa de Mentores",
    "template_key": "mentor-program"
  },
  "mentor": {
    "first_name": "Noel",
    "last_name": "Rivera",
    "photo_url": "...",
    "slug": "noel-rivera"
  },
  "actions": [
    {
      "action_key": "whatsapp",
      "label": "Contactar",
      "url": "https://wa.me/...",
      "order": 1
    }
  ]
}
```

## Principios de Diseño

1. **Cada landing es un componente independiente** - No comparte secciones con otras landings
2. **Acciones dinámicas** - Los botones se renderizan desde `actions[]`
3. **Sin duplicación de proyectos** - Todas las landings viven en el mismo proyecto
4. **Emergent como motor** - Nuevas landings se crean mediante prompts a Emergent
5. **Sin cambios de backend** - Crear una nueva landing no requiere modificar el backend

## Checklist para Nuevos Templates

- [ ] Crear archivo `Landing[Nombre].jsx` en `/templates/`
- [ ] Recibir props: `{ mentorData, onActionClick }`
- [ ] Renderizar mentor dinámicamente (foto, nombre)
- [ ] Renderizar acciones dinámicamente (`actions.map()`)
- [ ] Llamar `onActionClick(action_key)` al hacer clic
- [ ] Agregar a `TEMPLATE_REGISTRY` en `index.js`
- [ ] Actualizar campaña en Admin con nuevo `template_key`

---

*Documento actualizado: Diciembre 2024*
*Proyecto: InverSer Multi-Campaign Marketing Platform*
