# 🔧 Panel de Edición para Mentores - Documentación

## ✅ IMPLEMENTACIÓN COMPLETADA

---

## 🎯 Funcionalidad

El Panel de Edición permite a los mentores actualizar sus enlaces de forma segura mediante un **magic link** con token temporal, sin necesidad de usuario ni contraseña.

---

## 🔗 Acceso al Panel

### URL del Panel
```
/edit/{slug}?token={magic_token}
```

### Ejemplo Real
```
https://cpn-redesign.preview.emergentagent.com/edit/noel-rivera?token=qoy6llrBNTjtVPznm89-a5EWoJvuqDokWHyWwgP3J6I
```

---

## 🔐 Seguridad Implementada

### 1. **Validación de Token**
- ✅ Token debe estar presente en query string
- ✅ Token se valida contra hash almacenado en BD
- ✅ Token debe pertenecer al mentor correcto
- ✅ Token debe estar activo (`is_valid: true`)
- ✅ Token no debe estar expirado

### 2. **Manejo de Errores**

#### **Sin Token**
```
Mensaje: "Token no proporcionado. Por favor, use el link mágico completo."
```

#### **Token Inválido o Expirado**
```
Mensaje: "Token inválido o expirado. Por favor, solicite un nuevo link de edición a su administrador."
```

#### **Mentor No Encontrado**
```
Mensaje: "Mentor no encontrado."
```

---

## 🎨 Características del Panel

### ✅ Lo que el Mentor PUEDE hacer:
1. ✅ Ver su nombre completo (no puede editarlo)
2. ✅ Ver todas las acciones activas del sistema
3. ✅ Editar URLs de cada acción
4. ✅ Dejar campos vacíos (el botón se ocultará en su landing)
5. ✅ Probar cada enlace antes de guardar
6. ✅ Guardar todos los cambios de una vez
7. ✅ Ver confirmación de guardado exitoso

### ❌ Lo que el Mentor NO PUEDE hacer:
- ❌ Cambiar su slug
- ❌ Cambiar su nombre o apellido
- ❌ Subir/cambiar foto
- ❌ Ver estadísticas (visitas/clicks)
- ❌ Ver otros mentores
- ❌ Acceder al panel admin
- ❌ Crear/eliminar acciones

---

## 📋 Flujo de Uso

### 1. **Generación del Magic Link (Admin)**

```bash
# API Request
POST /api/admin/mentors/{mentor_id}/magic-link?days_valid=7

# Response
{
  "magic_link": "https://..../edit/noel-rivera?token=xxx",
  "expires_at": "2025-12-27T15:11:12.248121"
}
```

**Ejemplo con curl:**
```bash
curl -X POST "http://localhost:8001/api/admin/mentors/6946b322ec03d45e8b368942/magic-link?days_valid=7"
```

### 2. **Mentor Recibe el Link**
- Admin envía el magic link al mentor por email/WhatsApp
- Mentor hace click en el link
- No necesita login ni contraseña

### 3. **Mentor Edita sus Enlaces**
1. Página carga con sus enlaces actuales pre-llenados
2. Modifica las URLs que desee
3. Click en "Guardar Cambios"
4. Ve confirmación de éxito
5. Cambios reflejados inmediatamente en su landing pública

### 4. **Validación de Cambios**
- Mentor puede visitar su página pública: `/{slug}`
- Verifica que los botones abran las URLs correctas

---

## 🧪 Pruebas Realizadas

### ✅ Test 1: Acceso con Token Válido
- URL: `/edit/noel-rivera?token={valid_token}`
- Resultado: ✅ Panel carga correctamente
- Muestra: Nombre del mentor + 3 campos de edición

### ✅ Test 2: Edición y Guardado
- Acción: Cambiar URL de WhatsApp
- Resultado: ✅ Guardado exitoso
- Confirmación: Banner verde + Toast notification

### ✅ Test 3: Token Inválido
- URL: `/edit/noel-rivera?token=token-invalido`
- Resultado: ✅ Mensaje de error claro
- Acción sugerida: Solicitar nuevo link

### ✅ Test 4: Sin Token
- URL: `/edit/noel-rivera`
- Resultado: ✅ Mensaje de error específico
- Mensaje: "Token no proporcionado"

---

## 🎨 UI/UX Implementada

### Diseño
- ✅ Fondo degradado morado/beige (matching con landing)
- ✅ Card centralizado con sombra
- ✅ Título "Panel de Edición"
- ✅ Saludo personalizado: "Hola, {nombre} {apellido}"

### Campos de Formulario
- ✅ Label con nombre de la acción
- ✅ Descripción opcional debajo del label
- ✅ Input tipo URL con placeholder
- ✅ Botón "Probar enlace" (abre en nueva pestaña)
- ✅ Validación visual: ⚠️ si URL no empieza con http

### Feedback Visual
- ✅ **Guardando**: Spinner + "Guardando..."
- ✅ **Éxito**: Banner verde + Toast notification
- ✅ **Error**: Toast rojo con mensaje específico

### Información Adicional
- ✅ Consejo al final: "Verifica en /{slug}"
- ✅ Responsive design (funciona en móvil y desktop)

---

## 🔄 API Backend Utilizada

### GET `/api/edit/{slug}?token={token}`
**Valida token y devuelve datos del mentor**

**Response exitosa:**
```json
{
  "mentor": {
    "first_name": "Noel",
    "last_name": "Rivera",
    "slug": "noel-rivera"
  },
  "actions": [
    {
      "action_key": "agenda",
      "label": "Agendar Llamada",
      "description": "Botón para agendar una llamada",
      "current_url": "https://calendly.com/..."
    }
  ]
}
```

**Errores posibles:**
- `401` - Token inválido o expirado
- `404` - Mentor no encontrado

### PUT `/api/edit/{slug}?token={token}`
**Actualiza los enlaces del mentor**

**Request body:**
```json
{
  "agenda": "https://nueva-url.com",
  "whatsapp": "https://wa.me/123",
  "formulario": ""
}
```

**Response exitosa:**
```json
{
  "success": true,
  "message": "Updated 2 links successfully"
}
```

---

## 🔒 Seguridad y Mejores Prácticas

1. ✅ **Tokens hasheados**: Solo hash SHA256 almacenado en BD
2. ✅ **Expiración configurable**: Default 30 días, ajustable
3. ✅ **Un token activo por mentor**: Al generar nuevo, se invalidan anteriores
4. ✅ **Validación en cada request**: Token + expiración + mentor match
5. ✅ **HTTPS en producción**: Links seguros en ambiente productivo
6. ✅ **Sin datos sensibles**: No se almacenan contraseñas ni info personal

---

## 📱 URLs en Producción

### Panel de Edición
```
https://cpn-redesign.preview.emergentagent.com/edit/{slug}?token={token}
```

### Generar Magic Link (Admin)
```
POST https://cpn-redesign.preview.emergentagent.com/api/admin/mentors/{id}/magic-link?days_valid=7
```

---

## 📝 Próximos Pasos

Una vez validado el Panel de Edición, continuaremos con:

1. **Import/Export CSV** - Subir y descargar mentores masivamente
2. **Panel Admin Completo** - UI para gestionar todo el sistema

---

## ✅ Resumen de Implementación

**Panel de Edición para Mentores - COMPLETO**

- ✅ Ruta `/edit/{slug}` configurada
- ✅ Validación de token funcional
- ✅ Manejo de errores robusto
- ✅ UI intuitiva y clara
- ✅ Edición de URLs únicamente
- ✅ Guardado exitoso con confirmación visual
- ✅ Token inválido/expirado manejado correctamente
- ✅ Sin acceso a datos sensibles
- ✅ Responsive y funcional en todos los dispositivos

**Estado:** ✅ LISTO PARA USO EN PRODUCCIÓN

---

**Documentación Generada:** 2024-12-20
