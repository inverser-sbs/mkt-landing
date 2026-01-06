# PRD - Mentor Program Platform

## Descripción del Proyecto
Plataforma de marketing full-stack (React, FastAPI, MongoDB) para gestión de campañas de mentores con landing pages dinámicas personalizables.

## Estado Actual
**Fecha:** 4 Enero 2026

### Landings Aprobadas
- **MPP (Mentor & Partner Program) v1.0** ✅ APROBADA
  - Hero responsive con card de mentor
  - Secciones: Intro Ecosistema, Certificación, Statement, Herramientas, IA, Kommunity, Toolbox, Directorio iProfesional, iPartner, CTA Final, FAQ
  - 18 preguntas frecuentes completas
  - Efectos parallax en secciones Directorio y CTA
  - Tipografía personalizada (Cormorant Garamond, Plus Jakarta Sans)
  - Sistema de botones con ButtonAnchor
  - Responsive optimizado para móvil

- **CPN (Certificación Profesional NeuroCoaching)**
  - Hero con card de mentor (estilo similar a MPP)
  - Sección de testimonios con carrusel dinámico (4 testimonios)
  - Foto miniatura de mentor en footer
  - FAQ Section

### Templates Disponibles
1. `cpn` - Certificación Profesional NeuroCoaching
2. `mpp` - Mentor & Partner Program (v1.0)
3. `suitex` - SuiteX

### Sistema de Botones (ButtonAnchor)
Cada landing tiene slots predefinidos donde se anclan botones configurables por mentor:
- Navbar, Hero (primary, secondary, profile)
- Secciones internas (certificación, partner, FAQ)
- CTA Final y Footer

## Arquitectura de Archivos Clave

```
/app/frontend/src/
├── templates/
│   ├── index.js (Registry de templates, slots y botones)
│   ├── LandingMPP.jsx (Landing MPP v1.0 - APROBADA)
│   ├── LandingCPN.jsx
│   └── LandingSuitex.jsx
├── components/
│   ├── ButtonAnchor.jsx (Sistema de botones)
│   ├── HeroSection.jsx (Hero para CPN)
│   ├── TestimonialsSection.jsx (Carrusel testimonios)
│   └── Footer.jsx
└── tailwind.config.js (Fuentes personalizadas)
```

## Backlog

### P1 - Próximas Tareas
- Configurar URLs reales de botones MPP en admin (Agendar, WhatsApp, etc.)
- Verificación final de landing CPN en producción

### P2 - Mejoras Futuras
- Admin Users + Permisos Granulares (RBAC)
- Historial de cambios de links
- Tracking de atribución
- Estado granular de mentores por campaña

## Documentación
- `/app/PROTOCOLOS_DESARROLLO.md` - Guía de desarrollo y deployment
- `/app/frontend/public/PROTOCOLOS_DESARROLLO.html` - Versión HTML

## Integraciones
- Google Fonts (Cormorant Garamond, Plus Jakarta Sans)
- Imágenes: Pexels (fondos parallax)

## Credenciales de Prueba
- Campaña MPP: `mpp`
- Campaña CPN: `cpn`
- Mentor demo: `demo-mentor`
- URLs de prueba:
  - `/mpp/demo-mentor`
  - `/cpn/demo-mentor`
