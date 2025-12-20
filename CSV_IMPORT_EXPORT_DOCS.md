# 📊 Import/Export CSV - Documentación Completa

## ✅ IMPLEMENTACIÓN COMPLETADA

---

## 🎯 Funcionalidades Implementadas

### 1. **Export CSV** ✅
- Exportar todos los mentores
- Exportar solo mentores activos
- Exportar por grupo específico
- Formato: CSV UTF-8
- Incluye todas las columnas + acciones dinámicas

### 2. **Import CSV** ✅
- Crear nuevos mentores
- Actualizar mentores existentes (por slug)
- Opción para NO sobrescribir links existentes
- Validación de datos
- Manejo de errores robusto

### 3. **Preview Import** ✅
- Vista previa sin hacer cambios
- Muestra qué será creado vs actualizado
- Detecta errores antes de importar

### 4. **Template Download** ✅
- Descarga plantilla con columnas correctas
- Incluye fila de ejemplo
- Columnas dinámicas según acciones activas

---

## 🔗 APIs Disponibles

### 1. Export Mentors
```http
GET /api/admin/csv/export?filter_type={type}&group_name={group}
```

**Query Parameters:**
- `filter_type`: "all", "active", or "group" (default: "all")
- `group_name`: Required if filter_type is "group"

**Response:**
- CSV file download
- Filename: `mentors_{filter}.csv`

**Ejemplos:**
```bash
# Exportar todos
curl "http://localhost:8001/api/admin/csv/export?filter_type=all" -o mentors.csv

# Exportar solo activos
curl "http://localhost:8001/api/admin/csv/export?filter_type=active" -o mentors_active.csv

# Exportar por grupo
curl "http://localhost:8001/api/admin/csv/export?filter_type=group&group_name=team" -o mentors_team.csv
```

---

### 2. Preview Import
```http
POST /api/admin/csv/preview
```

**Body:**
- Multipart form-data
- Field: `file` (CSV file)

**Response:**
```json
{
  "total_rows": 3,
  "new_mentors": [
    {
      "row": 2,
      "slug": "maria-gonzalez",
      "first_name": "María",
      "last_name": "González"
    }
  ],
  "existing_mentors": [],
  "errors": [],
  "columns_found": ["first_name", "last_name", ...]
}
```

**Ejemplo:**
```bash
curl -X POST "http://localhost:8001/api/admin/csv/preview" \
  -F "file=@mentors.csv"
```

---

### 3. Import Mentors
```http
POST /api/admin/csv/import?create_new={bool}&update_existing={bool}&overwrite_links={bool}
```

**Query Parameters:**
- `create_new`: Create new mentors (default: true)
- `update_existing`: Update existing mentors (default: true)
- `overwrite_links`: Overwrite existing links (default: true)

**Body:**
- Multipart form-data
- Field: `file` (CSV file)

**Response:**
```json
{
  "total_rows": 3,
  "created": 2,
  "updated": 1,
  "skipped": 0,
  "errors": []
}
```

**Ejemplos:**
```bash
# Crear y actualizar con sobrescritura
curl -X POST "http://localhost:8001/api/admin/csv/import" \
  -F "file=@mentors.csv"

# Solo crear nuevos
curl -X POST "http://localhost:8001/api/admin/csv/import?create_new=true&update_existing=false" \
  -F "file=@mentors.csv"

# Actualizar sin sobrescribir links
curl -X POST "http://localhost:8001/api/admin/csv/import?create_new=false&update_existing=true&overwrite_links=false" \
  -F "file=@mentors.csv"
```

---

### 4. Download Template
```http
GET /api/admin/csv/template
```

**Response:**
- CSV file download
- Filename: `mentors_template.csv`
- Includes example row

**Ejemplo:**
```bash
curl "http://localhost:8001/api/admin/csv/template" -o template.csv
```

---

## 📋 Formato del CSV

### Columnas Base (Requeridas)
- `first_name` - Nombre (requerido)
- `last_name` - Apellido (requerido)
- `slug` - Identificador único (requerido, lowercase, hyphens only)

### Columnas Base (Opcionales)
- `email` - Email del mentor
- `active` - "true" o "false" (default: true)
- `mentor_group` - Grupo del mentor (ej: "team", "premium")
- `photo_url` - URL de la foto

### Columnas de Acciones (Dinámicas)
- `action:{action_key}` - URL del enlace
- Ejemplo: `action:agenda`, `action:whatsapp`, `action:formulario`
- Si está vacío, el botón no aparecerá en la landing

### Ejemplo de CSV
```csv
first_name,last_name,email,slug,active,mentor_group,photo_url,action:agenda,action:whatsapp,action:formulario
María,González,maria@ejemplo.com,maria-gonzalez,true,team,https://ejemplo.com/foto.jpg,https://calendly.com/maria,https://wa.me/123,https://forms.gle/form
Carlos,Rodríguez,carlos@ejemplo.com,carlos-rodriguez,false,premium,,https://calendly.com/carlos,,
```

---

## 🛠️ Script Helper de Python

### Instalación de Dependencias
```bash
pip install requests
```

### Uso del Script

#### 1. Exportar Mentores
```bash
# Todos
python csv_helper.py export all

# Solo activos
python csv_helper.py export active

# Por grupo
python csv_helper.py export group team
```

#### 2. Preview de Import
```bash
python csv_helper.py preview mentors.csv
```

#### 3. Importar Mentores
```bash
# Con todas las opciones por defecto
python csv_helper.py import mentors.csv

# Solo crear nuevos (no actualizar)
python csv_helper.py import mentors.csv true false true

# Actualizar sin sobrescribir links
python csv_helper.py import mentors.csv false true false
```

#### 4. Descargar Template
```bash
python csv_helper.py template
```

---

## 🧪 Pruebas Realizadas

### ✅ Test 1: Export All
```bash
curl "http://localhost:8001/api/admin/csv/export?filter_type=all"
```
**Resultado:** ✅ CSV con 4 mentores exportados correctamente

### ✅ Test 2: Preview Import
```bash
curl -X POST ".../preview" -F "file=@test_import.csv"
```
**Resultado:** ✅ Preview muestra 3 nuevos mentores, 0 errores

### ✅ Test 3: Import Create
```bash
curl -X POST ".../import" -F "file=@test_import.csv"
```
**Resultado:** ✅ 3 mentores creados, 0 errores

### ✅ Test 4: Import Update
```bash
curl -X POST ".../import?overwrite_links=true" -F "file=@update.csv"
```
**Resultado:** ✅ 1 mentor actualizado, links sobrescritos

### ✅ Test 5: Import Update (No Overwrite)
```bash
curl -X POST ".../import?overwrite_links=false" -F "file=@update.csv"
```
**Resultado:** ✅ 1 mentor actualizado, links NO sobrescritos

### ✅ Test 6: Template Download
```bash
curl ".../template" -o template.csv
```
**Resultado:** ✅ Template con columnas correctas + ejemplo

---

## 📊 Casos de Uso

### Caso 1: Importación Inicial de Mentores
1. Descargar template: `GET /template`
2. Llenar CSV con datos de mentores
3. Preview: `POST /preview` (verificar)
4. Importar: `POST /import` (crear todos)

### Caso 2: Actualización Masiva de Links
1. Exportar mentores actuales: `GET /export?filter_type=all`
2. Editar solo las columnas `action:*`
3. Importar: `POST /import?update_existing=true&overwrite_links=true`

### Caso 3: Agregar Links Sin Sobrescribir
1. Exportar: `GET /export`
2. Agregar nuevos links en columnas vacías
3. Importar: `POST /import?overwrite_links=false`

### Caso 4: Exportar Solo un Grupo
1. Exportar: `GET /export?filter_type=group&group_name=team`
2. Enviar CSV al líder del equipo
3. Líder edita y devuelve
4. Re-importar con filtro

---

## ⚠️ Validaciones y Manejo de Errores

### Validaciones en Import
- ✅ `slug` es requerido
- ✅ `first_name` y `last_name` son requeridos
- ✅ `slug` debe ser válido (lowercase, hyphens)
- ✅ `slug` duplicado → actualiza o salta según opciones
- ✅ `action:*` inválido → warning y skip esa acción
- ✅ `active` debe ser boolean-like ("true", "false", "1", "0")

### Errores Reportados
```json
{
  "errors": [
    {
      "row": 3,
      "error": "Missing required field: slug"
    },
    {
      "row": 5,
      "warning": "Unknown action 'invalid_action' - skipping"
    }
  ]
}
```

---

## 🔒 Seguridad

1. ✅ Solo formato CSV aceptado (validación de extensión)
2. ✅ UTF-8 encoding para caracteres especiales
3. ✅ Validación de slugs para evitar duplicados
4. ✅ Validación de URLs (opcional)
5. ✅ No se exponen IDs internos en export
6. ✅ Preview antes de commit changes

---

## 📱 URLs en Producción

### Export
```
GET https://landing-pro-30.preview.emergentagent.com/api/admin/csv/export
```

### Import
```
POST https://landing-pro-30.preview.emergentagent.com/api/admin/csv/import
```

### Preview
```
POST https://landing-pro-30.preview.emergentagent.com/api/admin/csv/preview
```

### Template
```
GET https://landing-pro-30.preview.emergentagent.com/api/admin/csv/template
```

---

## ✅ Resumen de Implementación

**Import/Export CSV - COMPLETO**

- ✅ Export: all / active / group
- ✅ Import: create / update / overwrite options
- ✅ Preview: sin cambios, validación previa
- ✅ Template: descarga plantilla con ejemplo
- ✅ Script helper: Python CLI para facilitar uso
- ✅ Validaciones robustas
- ✅ Manejo de errores detallado
- ✅ UTF-8 encoding para caracteres especiales
- ✅ Columnas dinámicas según acciones

**Estado:** ✅ LISTO PARA USO EN PRODUCCIÓN

**Próximo paso:** Panel Admin React completo

---

**Documentación Generada:** 2024-12-20
