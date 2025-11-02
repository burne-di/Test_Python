# 🔧 Troubleshooting - Error de Carga de CSV

## Problema
Al ejecutar ejercicios de Pandas en `learn.html`, aparece el error:
```
FileNotFoundError: [Errno 44] No such file or directory: 'sample_data.csv'
```

## ✅ Soluciones Implementadas

### 1. **Carga Automática de Datasets**
El sistema ahora carga automáticamente los archivos CSV cuando:
- Se abre un ejercicio que requiere un dataset
- Se ejecuta código Python que necesita el archivo

### 2. **Debugging Mejorado**
Se agregaron logs detallados en la consola del navegador para diagnosticar problemas.

---

## 📋 Pasos para Verificar y Solucionar

### **Paso 1: Verificar Rutas con test_csv.html**

1. Abre en tu navegador (local o GitHub Pages):
   ```
   https://TU-USUARIO.github.io/TU-REPO/test_csv.html
   ```

2. El archivo probará automáticamente 4 rutas diferentes:
   - `datasets/sample_data.csv` (ruta relativa simple)
   - `./datasets/sample_data.csv` (con ./)
   - `/datasets/sample_data.csv` (absoluta desde raíz)
   - `../datasets/sample_data.csv` (relativa con ../)

3. **Identifica cuál ruta funciona** (debe mostrar ✅)

### **Paso 2: Verificar en la Consola del Navegador**

1. Abre `learn.html?id=learn_005` (ejercicio de Pandas)
2. Presiona **F12** para abrir DevTools
3. Ve a la pestaña **Console**
4. Busca estos mensajes:

```
📂 Current location: https://...
📂 Fetching dataset from: datasets/sample_data.csv
📂 Full URL will be: https://...
📡 Response status: 200 OK  ← Debe ser 200, no 404
✓ Fetched XXX bytes
✓ First 100 chars: user_id,amount,category...
```

### **Paso 3: Si el fetch retorna 404**

El problema es la ruta en GitHub Pages. Opciones:

#### **Opción A: Verificar estructura de carpetas**
Asegúrate de que tu estructura sea:
```
docs/
├── learn.html
├── datasets/
│   └── sample_data.csv
└── js/
    └── learn.js
```

#### **Opción B: Ajustar la ruta base**

Si tu sitio está en un subdirectorio (ej: `usuario.github.io/proyecto/`), edita `learn.js`:

```javascript
// Línea 316 en learn.js - CAMBIAR DE:
const datasetPath = `datasets/${filename}`;

// A (para GitHub Pages con subdirectorio):
const datasetPath = `/proyecto/datasets/${filename}`;  // ← Cambia "proyecto" por tu repo
```

#### **Opción C: Usar ruta absoluta**

```javascript
// Línea 316 en learn.js
const datasetPath = `${window.location.origin}/datasets/${filename}`;
```

---

## 🧪 Prueba Rápida en Consola

Pega esto en la consola del navegador mientras estás en `learn.html`:

```javascript
// Test de fetch manual
fetch('datasets/sample_data.csv')
  .then(r => r.ok ? r.text().then(t => console.log('✅ CSV encontrado:', t.length, 'bytes')) : console.error('❌ 404 Not Found'))
  .catch(e => console.error('❌ Error:', e));
```

---

## 📊 Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| `404 Not Found` | Ruta incorrecta | Usar ruta absoluta o verificar estructura |
| `CORS error` | Accediendo desde `file://` | Usar servidor web (Live Server o GitHub Pages) |
| `File exists but Pyodide can't read` | No se escribió correctamente | Ver logs de `FS.writeFile` en consola |
| `Dataset not found` pero el fetch funciona | Problema con Pyodide FS | Reiniciar página (Ctrl+Shift+R) |

---

## 🔍 Logs de Debugging

Los nuevos logs te dirán exactamente qué está pasando:

1. **Cuando se carga el ejercicio:**
   ```
   ⏳ Preparando dataset "sample_data.csv"...
   ```

2. **Cuando intenta cargar:**
   ```
   📂 Current location: https://...
   📂 Fetching dataset from: datasets/sample_data.csv
   📂 Full URL will be: https://...
   ```

3. **Si tiene éxito:**
   ```
   ✓ Fetched 500 bytes
   ✓ First 100 chars: user_id,amount...
   ✓ Dataset "sample_data.csv" cargado y listo para usar
   ```

4. **Si falla:**
   ```
   ✗ ERROR: No se pudo cargar "sample_data.csv"
   HTTP 404: No se encontró el archivo en datasets/sample_data.csv
   ```

---

## ✅ Verificación Final

Después de aplicar correcciones:

1. **Recarga la página** con `Ctrl + Shift + R` (fuerza recarga sin caché)
2. **Abre el ejercicio** "Pandas - Leer CSV" (`learn_005`)
3. **Verifica la consola** - debe mostrar:
   ```
   ✓ Dataset "sample_data.csv" cargado y listo para usar
   ```
4. **Escribe el código:**
   ```python
   import pandas as pd
   df = pd.read_csv('sample_data.csv')
   print(df.head(3))
   ```
5. **Presiona "Ejecutar"** - debe mostrar las primeras 3 filas del CSV

---

## 📞 Si Persiste el Problema

1. Copia el output completo de la consola (pestaña Console en DevTools)
2. Verifica la URL completa que intenta acceder (debe aparecer en los logs)
3. Prueba acceder manualmente a esa URL en una nueva pestaña
4. Si acceder manualmente funciona pero el código no, es un problema de Pyodide FS

---

## 🎯 Resumen de Archivos Modificados

- ✅ `docs/js/learn.js` - Sistema de carga de datasets mejorado
- ✅ `docs/ejercicios/learn_exercises.json` - Campo `dataset` agregado
- ✅ `docs/test_csv.html` - **NUEVO** - Herramienta de debugging
- ✅ `docs/TROUBLESHOOTING_CSV.md` - **NUEVO** - Esta guía

---

**Última actualización:** 2025-01-02
