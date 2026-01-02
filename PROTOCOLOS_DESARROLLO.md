# 📋 PROTOCOLOS DE DESARROLLO — InverSer MKT Landing

> **Documento de aprendizajes y buenas prácticas**  
> Basado en la experiencia real de construcción y despliegue de esta aplicación.  
> Última actualización: Enero 2025

---

## 📑 ÍNDICE

1. [Protocolo 1: Agregar Nueva Landing](#protocolo-1-agregar-nueva-landing)
2. [Protocolo 2: Despliegue en EasyPanel](#protocolo-2-despliegue-en-easypanel)
3. [Protocolo 3: Construcción de Nueva Aplicación](#protocolo-3-construcción-de-nueva-aplicación)
4. [Lecciones Aprendidas](#lecciones-aprendidas)
5. [Checklist Rápido](#checklist-rápido)

---

## PROTOCOLO 1: AGREGAR NUEVA LANDING

### 🎯 Objetivo
Incorporar una nueva landing page al proyecto sin romper las existentes ni afectar la estabilidad del sistema.

### 📝 Información Requerida ANTES de Empezar

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **campaign_key** | Identificador único de la campaña (sin espacios, lowercase) | `neurocoaching`, `liderazgo2025` |
| **Nombre de campaña** | Título visible en admin y landing | "NeuroCoaching Ejecutivo" |
| **Estructura de secciones** | Qué bloques lleva la landing | Hero, Mentores, CTA, Footer |
| **Colores** | Paleta de colores (hex o nombre) | `#1E3A5F`, `#F4A261` |
| **Textos finales** | Copy aprobado para cada sección | Título hero, subtítulo, CTA |
| **Imágenes** | URLs o archivos de imágenes | Logo, fotos mentores, background |
| **Mentores** | Lista con datos completos | Ver tabla abajo |
| **Botones/Links** | Destinos de cada CTA | WhatsApp, formulario, etc. |

### 📋 Datos de Mentor Requeridos

```
Por cada mentor:
- Nombre completo
- Slug (URL-friendly, ej: "juan-perez")
- Foto (archivo o URL)
- Título/Cargo
- Especialidad
- Bio corta (2-3 líneas)
- LinkedIn (opcional)
- Email (opcional)
```

### ⚠️ REGLAS DE PROTECCIÓN

1. **NO modificar** archivos de otras landings existentes
2. **NO cambiar** componentes compartidos sin validar impacto
3. **NO alterar** `ButtonAnchor` ni templates base aprobados
4. **NO tocar** rutas de API existentes
5. **Crear archivos nuevos** para la nueva landing (no reutilizar)

### 🔄 Flujo de Trabajo

```
1. PREPARACIÓN
   └── Reunir TODA la información (ver tabla arriba)
   └── Validar que campaign_key no existe
   └── Preparar imágenes en formato correcto (PNG/JPG, <2MB)

2. BACKEND (si aplica)
   └── Crear campaña en DB vía admin
   └── Cargar mentores con fotos
   └── Verificar que /api/campaigns/{key} responde OK

3. FRONTEND
   └── Crear componente Landing{CampaignKey}.jsx
   └── Agregar ruta en App.js o router
   └── NO modificar componentes existentes

4. VALIDACIÓN
   └── Probar en local: localhost:3000/{campaign_key}
   └── Verificar carga de imágenes
   └── Probar todos los links/botones
   └── Revisar responsive (móvil, tablet, desktop)

5. DEPLOY
   └── Seguir Protocolo 2 (Despliegue)
```

### ✅ Checklist Pre-Entrega

- [ ] Todas las imágenes cargan correctamente
- [ ] Todos los textos están correctos (sin Lorem Ipsum)
- [ ] Links funcionan (WhatsApp, formularios, etc.)
- [ ] Responsive OK en 3 breakpoints
- [ ] No hay errores en consola del navegador
- [ ] Landing existentes siguen funcionando

---

## PROTOCOLO 2: DESPLIEGUE EN EASYPANEL

### 🎯 Objetivo
Desplegar cambios a producción de forma segura, sin downtime ni pérdida de datos.

### 📋 Variables de Entorno REQUERIDAS

| Variable | Valor | Dónde configurar |
|----------|-------|------------------|
| `FRONTEND_URL` | `https://mktlanding.inverser.sbs` | docker-compose.yml (hardcoded) |
| `PUBLIC_API_URL` | `https://mktlanding.inverser.sbs` | docker-compose.yml (hardcoded) |
| `MONGO_DB_NAME` | `inverser_db` | EasyPanel env global |
| `ADMIN_PASSWORDS` | `password1\|password2` | EasyPanel env global |
| `CORS_ORIGINS` | `*` o dominios específicos | docker-compose.yml |

### ⚠️ LECCIONES CRÍTICAS APRENDIDAS

```
❌ NUNCA usar defaults con localhost en docker-compose:
   FRONTEND_URL=${FRONTEND_URL:-http://localhost}  ← MAL
   
✅ SIEMPRE hardcodear URLs de producción:
   FRONTEND_URL=https://mktlanding.inverser.sbs   ← BIEN

❌ NUNCA asumir que EasyPanel inyecta variables correctamente
✅ SIEMPRE verificar con endpoint de debug temporal

❌ NUNCA confiar en que "local funciona = producción funciona"
✅ SIEMPRE probar en producción después del deploy
```

### 🔄 Flujo de Despliegue

```
1. PRE-DEPLOY
   └── Verificar que local funciona 100%
   └── Revisar que no hay console.log sensibles
   └── Confirmar que no hay endpoints de debug
   └── Verificar docker-compose.yml tiene URLs correctas

2. DEPLOY
   └── Commit + Push a GitHub
   └── En EasyPanel: Rebuild (usar no-cache si hay problemas)
   └── Esperar que el build termine (ver logs)

3. POST-DEPLOY (Validación inmediata)
   └── /api/health → debe responder 200
   └── Login admin → debe funcionar
   └── Fotos de mentores → deben cargar
   └── Magic links → dominio correcto
   └── Landing pública → renderiza OK

4. SI ALGO FALLA
   └── Revisar logs de EasyPanel
   └── Agregar endpoint de debug temporal
   └── Identificar causa raíz
   └── Fix → Redeploy → Validar → Eliminar debug
```

### 🛠️ Troubleshooting Común

| Síntoma | Causa Probable | Solución |
|---------|----------------|----------|
| Login falla | Env ADMIN_PASSWORDS no llega | Hardcodear passwords en código |
| Fotos no cargan | Nginx no rutea /api/uploads | Agregar location ^~ en nginx.conf |
| Magic link con localhost | ENV usa defaults | Hardcodear FRONTEND_URL |
| API no responde | Backend no inició | Revisar logs, verificar MONGO_URL |
| 502 Bad Gateway | Servicios no conectan | Verificar network en docker-compose |

### 📁 Archivos Clave para Deploy

```
/app/
├── docker-compose.yml      ← Configuración principal
├── backend/
│   ├── Dockerfile          ← Build del backend
│   └── .env                ← Variables locales (NO producción)
└── frontend/
    ├── Dockerfile          ← Build del frontend
    └── nginx.conf          ← Routing de Nginx (crítico)
```

---

## PROTOCOLO 3: CONSTRUCCIÓN DE NUEVA APLICACIÓN

### 🎯 Objetivo
Crear una nueva aplicación desde cero aplicando las lecciones aprendidas.

### 📋 Fase 1: Requerimientos (ANTES de escribir código)

```
1. FUNCIONALIDAD CORE
   └── ¿Qué problema resuelve?
   └── ¿Quién es el usuario final?
   └── ¿Cuáles son las 3 funciones principales?
   └── ¿Qué NO debe hacer? (límites claros)

2. DISEÑO Y UX
   └── Wireframes o mockups aprobados
   └── Paleta de colores definida
   └── Tipografía seleccionada
   └── Responsive: ¿qué breakpoints?

3. DATOS
   └── ¿Qué entidades maneja? (usuarios, productos, etc.)
   └── ¿Qué campos tiene cada entidad?
   └── ¿Qué relaciones existen?
   └── ¿Hay datos iniciales/semilla?

4. INTEGRACIONES
   └── ¿Necesita autenticación?
   └── ¿Qué APIs externas usa?
   └── ¿Pagos? ¿Email? ¿SMS?
   └── ¿Tiene todas las API keys?

5. DEPLOY
   └── ¿Dónde se desplegará?
   └── ¿Dominio definido?
   └── ¿SSL/HTTPS?
   └── ¿Quién tiene acceso a la plataforma?
```

### 📋 Fase 2: Arquitectura Base

```
Stack Recomendado (probado en esta app):
├── Frontend: React + Tailwind CSS
├── Backend: FastAPI (Python)
├── Database: MongoDB
├── Deploy: Docker + docker-compose
└── Hosting: EasyPanel (u otro compatible)

Estructura de Archivos:
/app
├── docker-compose.yml
├── .env.example
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── server.py
│   ├── routes/
│   ├── services/
│   └── models/
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    └── src/
        ├── components/
        ├── pages/
        └── utils/
```

### 📋 Fase 3: Orden de Construcción

```
1. BACKEND PRIMERO
   └── Configurar MongoDB
   └── Crear modelos de datos
   └── Implementar endpoints CRUD básicos
   └── Probar con curl/Postman
   └── ✓ Backend funcional antes de tocar frontend

2. FRONTEND BÁSICO
   └── Estructura de carpetas
   └── Routing configurado
   └── Conexión a API funcionando
   └── Componentes básicos sin estilos
   └── ✓ Flujo completo funciona (feo pero funciona)

3. DISEÑO Y ESTILOS
   └── Aplicar diseño aprobado
   └── Responsive
   └── Estados de loading/error
   └── ✓ Visualmente completo

4. DEPLOY TEMPRANO
   └── No esperar al final
   └── Desplegar cuando backend+frontend básicos funcionan
   └── Iterar en producción
   └── ✓ Detectar problemas de deploy antes, no después
```

### ⚠️ REGLAS DE ORO

```
1. NO empezar sin requerimientos claros
   → Preguntar TODO antes de escribir código

2. NO asumir nada sobre el entorno de producción
   → Variables de entorno: verificar siempre

3. NO hardcodear URLs locales
   → Usar variables de entorno desde el día 1

4. NO dejar endpoints de debug en producción
   → Agregar → Usar → Eliminar → Redeploy

5. NO confiar en que local = producción
   → Probar cada feature en producción

6. NO hacer refactors innecesarios
   → Si funciona y está estable, no tocar

7. NO modificar código existente sin entenderlo
   → Leer primero, cambiar después

8. SIEMPRE tener un endpoint /api/health
   → Para verificar que el backend vive

9. SIEMPRE documentar decisiones importantes
   → El próximo desarrollador (o tú en 3 meses) lo agradecerá

10. SIEMPRE hacer backup antes de cambios grandes
    → Git es tu amigo
```

---

## LECCIONES APRENDIDAS

### 🔴 Errores que Cometimos y NO Repetir

| Error | Consecuencia | Lección |
|-------|--------------|---------|
| Defaults `:-http://localhost` en docker-compose | Magic links rotos en producción | Hardcodear URLs de producción |
| No verificar variables en runtime | Horas debugueando | Agregar endpoint de diagnóstico |
| Confiar en que EasyPanel inyecta envs | Variables no llegaban | No depender de inyección externa |
| No tener endpoint /health | No saber si backend vivía | Siempre incluir health check |
| Dejar endpoints de debug | Exposición de información | Eliminar SIEMPRE después de usar |
| Nginx no ruteaba /api/uploads | Fotos 404 | Usar `location ^~` para prioridad |
| Cambiar muchas cosas a la vez | No saber qué rompió qué | Cambios pequeños, validar cada uno |

### 🟢 Cosas que Funcionaron Bien

| Práctica | Beneficio |
|----------|-----------|
| Endpoints de debug temporales | Diagnóstico rápido en producción |
| Hardcodear valores críticos | Eliminar dependencias externas |
| Probar con curl antes de frontend | Aislar problemas backend vs frontend |
| Documentar cada cambio | Saber qué se hizo y por qué |
| Validar en producción inmediatamente | Detectar problemas rápido |

---

## CHECKLIST RÁPIDO

### Antes de Empezar Cualquier Cambio
- [ ] ¿Tengo claro qué debo hacer?
- [ ] ¿Tengo toda la información necesaria?
- [ ] ¿Sé qué archivos voy a modificar?
- [ ] ¿Esto puede afectar algo existente?

### Antes de Hacer Deploy
- [ ] ¿Funciona en local?
- [ ] ¿docker-compose.yml tiene URLs correctas?
- [ ] ¿No hay console.log sensibles?
- [ ] ¿No hay endpoints de debug?
- [ ] ¿Hice commit de todos los cambios?

### Después del Deploy
- [ ] ¿/api/health responde 200?
- [ ] ¿Login funciona?
- [ ] ¿Features principales funcionan?
- [ ] ¿No hay errores en consola?
- [ ] ¿Landings existentes siguen OK?

---

## 📞 CONTACTO Y SOPORTE

Si tienes dudas sobre estos protocolos o encuentras situaciones no cubiertas:

1. Revisar este documento primero
2. Verificar logs de EasyPanel
3. Agregar endpoint de debug temporal para diagnosticar
4. Documentar el problema y solución para futuras referencias

---

> **Nota Final**: Este documento debe actualizarse cada vez que se aprenda algo nuevo. El conocimiento que no se documenta, se pierde.

---

*Documento generado basado en la experiencia de desarrollo de InverSer MKT Landing Platform, Enero 2025.*
