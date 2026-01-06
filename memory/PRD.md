# PRD - Mentor Program Platform

## Descripción del Proyecto
Plataforma de marketing full-stack (React, FastAPI, MongoDB) para gestión de campañas de mentores con landing pages dinámicas personalizables.

## Estado Actual
**Fecha:** 6 Enero 2026

### Landings Aprobadas
- **MPP (Mentor & Partner Program) v1.0** ✅ APROBADA
- **CPN (Certificación Profesional NeuroCoaching) v2.0** 🔄 EN REVISIÓN

---

## Landing MPP v1.0 (APROBADA)

### Secciones
1. Hero responsive con card de mentor
2. Intro Ecosistema
3. Certificación
4. Statement
5. Herramientas
6. IA (MIA)
7. Kommunity
8. Toolbox
9. Directorio iProfesional (parallax)
10. iPartner
11. CTA Final (parallax)
12. FAQ (18 preguntas + botón "Quiero Unirme")
13. Footer

### Características
- Tipografía personalizada (Cormorant Garamond, Plus Jakarta Sans)
- Sistema de botones con ButtonAnchor
- Responsive optimizado para móvil
- Efectos parallax en múltiples secciones

---

## Landing CPN v2.0 (PENDIENTE APROBACIÓN FINAL)

### Secciones Implementadas
1. **Hero** - Card de mentor + parallax + **4 acreditaciones con logos** (GCF, CEL, CIC, FGU)
2. **TransformaSER** - Filosofía del SER (NUEVA)
3. **¿Es para ti?** - Reenfocada desde la posibilidad
4. **Qué Lograrás** - Beneficios actualizados
5. **Metodología PEDALEAR** - Enriquecida
6. **7 Ejes Transformacionales** - (NUEVA, parallax)
7. **Niveles de Certificación** - 280, 180, 120 días
8. **Ecosistema Digital** - Herramientas (NUEVA)
9. **Comunidad** - Stats + parallax
10. **Tu Siguiente Paso** - De Coach a Mentor (reenfocada)
11. **Acreditaciones** - 4 logos con enlaces (GCF, CEL, FGU, CIC)
12. **Testimonios** - Carrusel 4 personas
13. **FAQ** - 10 preguntas actualizadas
14. **CTA Final** - Parallax
15. **Footer** - Con logo InverSer + foto mentor

### Última actualización (6 Enero 2026)
- ✅ Acreditaciones agregadas al Hero: 4 logos con fondo blanco, efecto hover y enlaces a las instituciones

---

## Templates Disponibles
1. `cpn` - Certificación Profesional NeuroCoaching (v2.0)
2. `mpp` - Mentor & Partner Program (v1.0)
3. `suitex` - SuiteX

## Sistema de Botones (ButtonAnchor)

### Slots CPN
- Navbar - Inscríbete
- Hero - Agendar Llamada / WhatsApp / Ver Perfil
- TransformaSER - Iniciar
- ¿Es para ti? - Entrevista
- Siguiente Paso - Partner
- CTA Final - Aplicar
- Footer - Ir al Perfil

### Slots MPP
- Navbar - Postular
- Hero - Agendar / WhatsApp / Ver Perfil
- Certificación - Ver
- Partner - Email
- CTA Final - Aplicar / WhatsApp
- FAQ - Quiero Unirme
- Footer - Ir al Perfil

---

## Arquitectura

```
/app/frontend/src/
├── templates/
│   ├── index.js (Registry)
│   ├── LandingMPP.jsx (v1.0 APROBADA)
│   ├── LandingCPN.jsx (v2.0)
│   └── LandingSuitex.jsx
├── components/
│   ├── ButtonAnchor.jsx
│   ├── AccreditationsSection.jsx (logos)
│   ├── TestimonialsSection.jsx
│   └── ...
```

## URLs de Prueba
- `/mpp/demo-mentor` - Landing MPP
- `/cpn/demo-mentor` - Landing CPN

## Logos y Assets
- InverSer: `https://customer-assets.emergentagent.com/job_landing-bugs/artifacts/ux8tcoz0_logo-02.png`
- GCF: `https://customer-assets.emergentagent.com/job_landing-bugs/artifacts/4oif9u9q_GCF-1.png`
- CEL: `https://customer-assets.emergentagent.com/job_landing-bugs/artifacts/4xct8y9m_CEL-1.png`
- FGU: `https://customer-assets.emergentagent.com/job_landing-bugs/artifacts/no18ggug_FGU_kit...`
- CIC: `https://customer-assets.emergentagent.com/job_landing-bugs/artifacts/2rkhabrt_CIC-1.jpg`

## Backlog

### P1 - Próximas Tareas
- Finalizar IDs de navegación en CPN
- Verificar menú móvil CPN
- Aprobar CPN v2.0

### P2 - Mejoras Futuras
- Admin Users + RBAC
- Historial de cambios de links
- Tracking de atribución
