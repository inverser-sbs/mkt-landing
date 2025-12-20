# InverSer Marketing System - Documentación

## ✅ SISTEMA COMPLETADO (Opción A)

El sistema de marketing por afiliación está **completamente funcional** con las siguientes características implementadas:

---

## 🎯 Funcionalidades Implementadas

### 1. **Landing Dinámica por Slug** ✅
- **URL**: `http://localhost:3000/{slug}`
- **Ejemplo**: `http://localhost:3000/noel-rivera`
- Renderiza página completa con información del mentor
- Muestra foto del mentor (círculo derecha en desktop)
- Botones dinámicos según acciones configuradas
- Si no hay link para una acción → botón oculto automáticamente

### 2. **Tracking Completo** ✅
- **Visitas**: Se registran al cargar la página
- **Clicks**: Se registran por cada botón clickeado con `action_key`
- **Estadísticas**: Disponibles en `/api/track/stats/all`

### 3. **Backend API Completo** ✅
- Modelos de datos: Mentor, Action, MentorLink, MagicToken, Event
- CRUD completo para mentores, acciones y links
- Tracking de eventos con hash de IP
- Bulk update de links
- Magic tokens para edición por mentores

---

## 🚀 Mentor de Prueba Creado

### **Noel Rivera**
- **Slug**: `noel-rivera`
- **URL Pública**: http://localhost:3000/noel-rivera
- **Foto**: Imagen de Unsplash
- **Links configurados**:
  - ✅ **Agendar Llamada**: Calendly
  - ✅ **Hablar por WhatsApp**: WhatsApp con mensaje pre-llenado
  - ✅ **Aplicar/Registrarme**: Google Forms

---

## 📊 Verificación de Funcionalidad

### Ver Estadísticas
```bash
curl http://localhost:8001/api/track/stats/all | python -m json.tool
```

**Resultado Actual**:
```json
{
    "mentor_id": "6946b322ec03d45e8b368942",
    "mentor_name": "Noel Rivera",
    "total_visits": 4,
    "total_clicks": 2,
    "visits_7d": 4,
    "visits_30d": 4,
    "clicks_by_action": {
        "whatsapp": 1,
        "agenda": 1
    }
}
```

### Ver Datos del Mentor
```bash
curl http://localhost:8001/api/public/mentor/noel-rivera | python -m json.tool
```

---

## 🔧 APIs Disponibles

### **Públicas**
- `GET /api/public/mentor/{slug}` - Obtener datos del mentor + acciones

### **Admin - Mentores**
- `POST /api/admin/mentors` - Crear mentor
- `GET /api/admin/mentors` - Listar mentores
- `GET /api/admin/mentors/{id}` - Obtener mentor
- `PUT /api/admin/mentors/{id}` - Actualizar mentor
- `DELETE /api/admin/mentors/{id}` - Eliminar mentor
- `POST /api/admin/mentors/{id}/photo` - Subir foto
- `POST /api/admin/mentors/{id}/magic-link` - Generar link mágico

### **Admin - Acciones**
- `POST /api/admin/actions` - Crear acción
- `GET /api/admin/actions` - Listar acciones
- `PUT /api/admin/actions/{key}` - Actualizar acción
- `DELETE /api/admin/actions/{key}` - Eliminar acción

### **Admin - Links**
- `POST /api/admin/links` - Crear/actualizar link
- `GET /api/admin/links/mentor/{id}` - Obtener links del mentor
- `DELETE /api/admin/links/mentor/{id}/action/{key}` - Eliminar link
- `POST /api/admin/links/bulk-update` - Actualización masiva

### **Tracking**
- `POST /api/track/event` - Registrar evento (visit/click)
- `GET /api/track/stats/mentor/{id}` - Stats de un mentor
- `GET /api/track/stats/all` - Stats de todos los mentores
- `GET /api/track/stats/countries` - Top países por visitas

### **Edición Mentor**
- `GET /api/edit/{slug}?token=xxx` - Validar token y obtener datos
- `PUT /api/edit/{slug}?token=xxx` - Actualizar links del mentor

---

## 🎨 Componentes Dinámicos

### **HeroSection**
- Recibe `mentorData` y `onActionClick`
- Muestra nombre completo del mentor
- Muestra foto del mentor (circular, lado derecho)
- Renderiza primeros 2 botones dinámicamente
- Tracking de clicks por action_key

### **CTASection**
- Recibe `mentorData` y `onActionClick`
- Muestra "Trabaja con {nombre} {apellido}"
- Renderiza TODOS los botones disponibles
- Tracking de clicks por action_key

---

## 📝 Acciones por Defecto Creadas

1. **agenda** - "Agendar Llamada" (orden: 1)
2. **whatsapp** - "Hablar por WhatsApp" (orden: 2)
3. **formulario** - "Aplicar / Registrarme" (orden: 3)

---

## 🛠️ Comandos Útiles

### Inicializar Base de Datos
```bash
cd /app/backend
python init_db.py
```

### Crear Mentor de Prueba
```bash
cd /app/backend
python create_test_mentor.py
```

### Reiniciar Servicios
```bash
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
```

### Ver Logs
```bash
# Backend
tail -f /var/log/supervisor/backend.err.log

# Frontend
tail -f /var/log/supervisor/frontend.out.log
```

---

## ✅ Pruebas Realizadas

1. ✅ Página `/noel-rivera` carga correctamente
2. ✅ Foto del mentor se muestra (círculo derecho)
3. ✅ Nombre "Noel Rivera" aparece en CTA
4. ✅ Botones dinámicos renderizan correctamente
5. ✅ Tracking de visitas funciona (4 visitas registradas)
6. ✅ Tracking de clicks funciona (2 clicks: agenda + whatsapp)
7. ✅ Stats API devuelve datos correctos
8. ✅ Clicks abren URLs configuradas en nueva pestaña

---

## 🎯 Próximos Pasos (No Implementados - Opción A Completa)

Para completar el sistema al 100%, faltarían:

1. **Panel Admin React** - UI para gestionar mentores/acciones/links
2. **Panel Edición Mentor** - UI para que mentor edite sus links con token
3. **Import/Export CSV** - Subir/descargar mentores masivamente
4. **Autenticación Admin** - Sistema de login para admin

---

## 📸 Screenshots

### Hero Section con Noel Rivera
- ✅ Foto circular a la derecha
- ✅ Nombre visible
- ✅ 2 botones: "Agendar Llamada" + "Hablar por WhatsApp"

### CTA Section
- ✅ Texto "Trabaja con Noel Rivera"
- ✅ 3 botones: Agendar, WhatsApp, Aplicar/Registrarme

---

## 🎉 Conclusión

**Opción A completada exitosamente end-to-end:**
- ✅ HeroSection y CTASection dinámicos
- ✅ Botones renderizados desde acciones activas
- ✅ Links por mentor funcionando
- ✅ Tracking de visitas y clicks operativo
- ✅ Mentor de prueba "noel-rivera" creado
- ✅ Slug `/noel-rivera` funcional
- ✅ Stats API mostrando datos reales

**El sistema está listo para uso básico y puede ser extendido con las funcionalidades de admin según se necesite.**
