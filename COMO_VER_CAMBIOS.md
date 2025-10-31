# 🔄 Cómo Ver los Cambios (Limpiar Caché del Navegador)

## ⚠️ PROBLEMA: "No veo los cambios nuevos"

Si hiciste cambios en el código pero **NO los ves en el navegador**, es porque el navegador está mostrando una **versión cacheada (antigua)** de los archivos.

---

## ✅ SOLUCIÓN: Forzar Recarga

### Opción 1: Hard Refresh (Más Rápido) ⭐ RECOMENDADO

**Windows/Linux:**
- Chrome/Edge: `Ctrl + Shift + R` o `Ctrl + F5`
- Firefox: `Ctrl + Shift + R`

**Mac:**
- Chrome/Safari: `Cmd + Shift + R`
- Firefox: `Cmd + Shift + R`

### Opción 2: Limpiar Caché Completo

#### Chrome/Edge:
1. Presiona `F12` para abrir DevTools
2. Click derecho en el botón **Reload** (junto a la barra de URL)
3. Selecciona **"Empty Cache and Hard Reload"**

O:
1. `Ctrl + Shift + Delete` (Windows) o `Cmd + Shift + Delete` (Mac)
2. Selecciona "Cached images and files"
3. Selecciona "Last hour" o "All time"
4. Click "Clear data"

#### Firefox:
1. `Ctrl + Shift + Delete`
2. Marca "Cache"
3. Click "Clear Now"

#### Safari:
1. `Cmd + Option + E` para vaciar caché
2. Luego `Cmd + R` para recargar

---

## 🔍 Verificar que Funcionó

Después de limpiar caché, verifica:

### 1. Dataset Modal Funciona
- Abre cualquier ejercicio
- Click en "👁️ Ver Dataset"
- Debe abrir un **modal con tabla completa** (NO un alert)
- Debes ver filas y columnas del dataset

### 2. Hints Funcionan
- Click en "💡 Obtener Pista (3 disponibles)"
- Debe abrir un **modal amarillo con la pista**
- NO debe ser un alert simple

### 3. Conocimiento Teórico Aparece
- En ejercicio Python 001
- Debes ver sección **"📚 Conocimiento Teórico Requerido"**
- Con botón "Mostrar Conceptos"
- Click muestra 5 conceptos con ejemplos de código

---

## 🐛 Si Aún No Funciona

### Paso 1: Verifica la consola del navegador

1. Presiona `F12` para abrir DevTools
2. Ve a la pestaña **Console**
3. Busca errores en **rojo**
4. Toma captura y comparte

### Paso 2: Verifica los archivos

Confirma que estos archivos existen y tienen las actualizaciones:

```bash
docs/
├── solve.html          # Debe tener <div class="knowledge-section">
├── css/solve.css       # Debe tener /* Knowledge Section */
├── js/solve.js         # Debe tener function displayKnowledge()
├── ejercicios/
│   └── exercises.json  # Python 001 debe tener "knowledge": [...]
└── datasets/
    └── raw_customer_data.csv  # Debe existir
```

### Paso 3: Reinicia el servidor local

```bash
# Para el servidor (Ctrl + C)
# Reinicia
python -m http.server 8000
```

### Paso 4: Usa modo incógnito

- Chrome: `Ctrl + Shift + N`
- Firefox: `Ctrl + Shift + P`
- Abre `http://localhost:8000` en ventana incógnita

---

## 📋 Checklist de Verificación

Después de limpiar caché, confirma que funciona:

- [ ] Modal de dataset se abre correctamente
- [ ] Tabla de dataset muestra datos (no alert placeholder)
- [ ] Botón "Ver Dataset" funciona
- [ ] Hints se muestran en modal amarillo
- [ ] Contador de hints actualiza (3 → 2 → 1 → 0)
- [ ] Sección "Conocimiento Teórico" aparece en Python 001
- [ ] Botón "Mostrar Conceptos" expande/colapsa contenido
- [ ] Se ven 5 conceptos con ejemplos de código
- [ ] Ejemplos tienen sintaxis, ejemplo y output

---

## 🎯 Archivos que Deben Estar Actualizados

### solve.html (línea ~40)
```html
<!-- Knowledge Section -->
<div class="knowledge-section" id="knowledge-section">
```

### solve.css (línea ~343)
```css
/* Knowledge Section */
.knowledge-section {
    background: #eff6ff;
```

### solve.js (línea ~83)
```javascript
// Display knowledge
function displayKnowledge() {
```

### exercises.json (Python 001, línea ~70)
```json
"knowledge": [
  {
    "concept": "Pandas drop_duplicates()",
```

---

## 💡 Tip: Desactivar Caché Durante Desarrollo

Para evitar este problema en el futuro:

1. Abre DevTools (`F12`)
2. Ve a **Network** tab
3. Marca checkbox **"Disable cache"**
4. Deja DevTools abierto mientras desarrollas

---

## ✅ Todo Debe Funcionar Ahora

Si seguiste estos pasos, deberías ver:

1. **Dataset Modal completo** con tabla scrolleable
2. **Hints en modal amarillo** con código formateado
3. **Conocimiento Teórico** con 5 conceptos interactivos
4. **Ejemplos de Input/Output** claramente mostrados

---

¿Aún tienes problemas? Revisa la consola del navegador (F12) y busca errores en rojo. 🔍
